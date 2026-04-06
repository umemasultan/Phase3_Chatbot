"""
AI Agent Service using OpenAI Agents SDK
Implements Agent + Runner pattern with MCP tools
"""
import asyncio
from typing import Dict, Any, List
from sqlmodel import Session, select
import sys
import os

# Add the src directory to the path to allow absolute imports
src_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from models.conversation import Conversation, ConversationCreate
from models.message import Message, MessageCreate, MessageRole
from db.database import engine
from datetime import datetime
from services.mcp_client_official import get_mcp_client


class AIAgentService:
    def __init__(self):
        # Initialize official MCP client to connect to our MCP server
        self.mcp_client = get_mcp_client()

    @property
    def client(self):
        """Lazy initialization of OpenAI client"""
        if not hasattr(self, '_client'):
            import os
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key:
                from openai import OpenAI
                self._client = OpenAI()
            else:
                self._client = None
        return self._client

    def create_agent_instructions(self) -> str:
        """
        Create system instructions for the AI agent
        """
        return """
        You are a helpful AI assistant that can manage tasks for users.
        When a user gives you commands, you should use the appropriate tools to complete them.
        Follow these rules:
        1. Use add_task for commands like 'add task', 'remember', 'create task'
        2. Use list_tasks for commands like 'show tasks', 'list tasks', 'what do I have to do'
        3. Use complete_task for commands like 'complete task', 'done', 'finished', 'mark as done'
        4. Use delete_task for commands like 'delete task', 'remove task', 'cancel task'
        5. Use update_task for commands like 'change task', 'update task', 'rename task'
        6. Always confirm important actions before executing them
        7. Provide friendly, helpful responses
        """

    async def process_user_message_async(self, user_id: int, message: str, conversation_id: str = None) -> Dict[str, Any]:
        """
        Process a user message asynchronously using OpenAI Agents SDK pattern
        """
        try:
            # Get or create conversation
            conversation = self._get_or_create_conversation(user_id, conversation_id)

            # Store user message
            self._store_message(user_id, conversation.id, message, MessageRole.user)

            # Check if we have an OpenAI API key configured
            import os
            from core.config import settings
            openai_api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
            if not openai_api_key:
                # If no API key, provide a friendly response
                ai_response = self._get_simple_response(message, user_id)
                self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)
                return {
                    "response": ai_response,
                    "conversation_id": str(conversation.id),
                    "message_id": "temp_id"
                }

            # Get conversation history for the agent
            conversation_history = self._get_conversation_history(conversation.id)

            # Build messages array with system instruction
            messages = [
                {"role": "system", "content": self.create_agent_instructions()}
            ]

            # Add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

            # Add current message
            messages.append({"role": "user", "content": message})

            # Get tool definitions for the agent
            tools = self.mcp_client.get_tool_definitions_for_openai()

            # Use OpenAI API with function calling (Agents SDK pattern)
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_api_key)

                # First API call - let the agent decide which tools to use
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    tools=tools,
                    tool_choice="auto"
                )
            except Exception as openai_error:
                error_msg = f"Error with OpenAI API: {str(openai_error)}"
                print(error_msg)
                # Check if it's a rate limit or quota error
                if "rate_limit" in str(openai_error).lower() or "quota" in str(openai_error).lower() or "429" in str(openai_error):
                    ai_response = "I'm currently experiencing API limitations. However, I can still help you! " + self._get_simple_response(message, user_id)
                else:
                    ai_response = self._get_simple_response(message, user_id)
                self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)
                return {
                    "response": ai_response,
                    "conversation_id": str(conversation.id) if conversation else "new",
                    "message_id": "temp_id"
                }

            # Handle tool calls if present (Runner pattern)
            response_message = response.choices[0].message
            tool_calls = response_message.tool_calls

            ai_response = ""

            if tool_calls:
                # Add the assistant's response with tool calls to messages
                messages.append(response_message)

                # Execute each tool call via MCP
                for tool_call in tool_calls:
                    function_name = tool_call.function.name
                    try:
                        function_args = eval(tool_call.function.arguments)
                    except Exception as args_error:
                        error_msg = f"Error parsing function arguments: {str(args_error)}"
                        print(error_msg)
                        messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": f'{{"error": "{error_msg}"}}'
                        })
                        continue

                    # Add user_id to arguments if not present
                    if "user_id" not in function_args:
                        function_args["user_id"] = user_id

                    try:
                        # Call the MCP tool
                        tool_result = await self.mcp_client.call_tool(function_name, function_args)

                        # Add the tool result to messages
                        messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": str(tool_result)
                        })
                    except Exception as tool_error:
                        error_msg = f"Error executing tool {function_name}: {str(tool_error)}"
                        print(error_msg)
                        messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": f'{{"error": "{error_msg}", "success": false}}'
                        })

                # Second API call - get the final response from the agent
                try:
                    if openai_api_key:
                        from openai import OpenAI
                        client = OpenAI(api_key=openai_api_key)
                        final_response = client.chat.completions.create(
                            model="gpt-3.5-turbo",
                            messages=messages
                        )
                        ai_response = final_response.choices[0].message.content
                    else:
                        ai_response = "I processed your request but need an API key to generate a detailed response."
                except Exception as final_response_error:
                    error_msg = f"Error getting final response from AI: {str(final_response_error)}"
                    print(error_msg)
                    ai_response = "I processed your request but encountered an issue forming a complete response."
            else:
                # No tools were called, use the initial response
                ai_response = response_message.content if response_message.content else "I received your message but couldn't process it. Could you please rephrase?"

            # Store AI response
            self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)

            return {
                "response": ai_response,
                "conversation_id": str(conversation.id),
                "message_id": "temp_id"
            }
        except Exception as e:
            return {
                "response": f"Sorry, I encountered an error processing your request: {str(e)}",
                "conversation_id": conversation_id or "new",
                "message_id": None,
                "error": str(e)
            }

    def _get_simple_response(self, message: str, user_id: int = None) -> str:
        """
        Provide a simple response when OpenAI API is not configured
        Also handles basic task operations directly
        """
        message_lower = message.lower()

        # Try to extract task title from common patterns
        task_title = None
        if any(keyword in message_lower for keyword in ['add task', 'create task', 'new task', 'add new', 'create new']):
            # Extract text after the command
            for keyword in ['add task', 'create task', 'new task', 'add new task', 'create new task']:
                if keyword in message_lower:
                    parts = message_lower.split(keyword, 1)
                    if len(parts) > 1 and parts[1].strip():
                        task_title = parts[1].strip()
                        break
        elif 'remember to' in message_lower:
            parts = message_lower.split('remember to', 1)
            if len(parts) > 1 and parts[1].strip():
                task_title = parts[1].strip()
        elif ('buy' in message_lower or 'purchase' in message_lower) and len(message_lower.split()) <= 5:
            task_title = message.strip()

        # If we extracted a task title and have a user_id, create the task
        if task_title and user_id:
            try:
                from sqlmodel import Session
                from db.database import engine
                from models.task import Task

                with Session(engine) as session:
                    new_task = Task(
                        user_id=user_id,
                        title=task_title.capitalize(),
                        description="",
                        status="pending"
                    )
                    session.add(new_task)
                    session.commit()
                    session.refresh(new_task)

                    return f"✓ Task created: '{new_task.title}'. Author: Umema Sultan. I've added this to your task list!"
            except Exception as e:
                print(f"Error creating task: {e}")
                return f"I understood you want to add '{task_title}', but encountered an error. Please try using the task manager interface. Author: Umema Sultan."

        if (any(keyword in message_lower for keyword in ['add task', 'create task', 'new task', 'remember to', 'create new', 'add new']) or
           ('buy' in message_lower or 'purchase' in message_lower) and (
               (len(message_lower.split()) <= 4) or
               (len(message_lower.split()) <= 5 and any(shopping_item in message_lower for shopping_item in ['groceries', 'grocery', 'items', 'things', 'products', 'food', 'purfume', 'perfume', 'purchases', 'supplies', 'essentials', 'medicine', 'medicines', 'gift', 'gifts', 'present', 'presents']))
           )):
            return "Sure! You can add tasks using the task manager interface. For example, you could add 'Buy groceries' as a new task. Author: Umema Sultan. I'm here to assist when my AI powers are enabled with an API key!"
        elif any(keyword in message_lower for keyword in ['delete', 'remove', 'cancel']):
            return "You can remove tasks from your list in the task manager. Author: Umema Sultan. With my AI enabled, I could help you manage these operations seamlessly!"
        elif any(keyword in message_lower for keyword in ['complete', 'done', 'finish', 'completed']):
            return "Great! You can mark tasks as complete in the task manager. Author: Umema Sultan. I'll be able to help you manage task completion automatically when my AI is enabled!"
        elif any(keyword in message_lower for keyword in ['update', 'change', 'modify', 'rename']):
            return "You can update tasks in the task manager interface. Author: Umema Sultan. When my AI is enabled, I can help update your tasks automatically!"
        elif any(keyword in message_lower for keyword in ['show', 'list', 'display', 'what']):
            return "You can view all your tasks in the task manager dashboard. This shows pending, in-progress, and completed tasks. Author: Umema Sultan. When I have my AI powers enabled, I can help manage them more intelligently!"
        elif 'my' in message_lower and any(keyword in message_lower for keyword in ['task', 'tasks']):
            return "You can view all your tasks in the task manager dashboard. This shows pending, in-progress, and completed tasks. Author: Umema Sultan. When I have my AI powers enabled, I can help manage them more intelligently!"
        elif any(keyword in message_lower for keyword in ['hello', 'hi', 'hey']):
            return f"Hello! Nice to meet you! Author: Umema Sultan. I'm your helpful task management assistant. I can help you create, delete, update, and manage your tasks. How can I assist you today?"
        elif any(keyword in message_lower for keyword in ['help']):
            return "I'm here to help manage your tasks! You can ask me to create, delete, update, or list tasks. Author: Umema Sultan. Try commands like 'add task', 'show tasks', 'complete task', or 'delete task'. How can I assist you?"
        else:
            return f"Hello! Author: Umema Sultan. I'm here to help manage your tasks! You can add, track, and complete tasks through the interface. I can help with creating, deleting, updating, and managing your tasks. How can I assist you today?"

    def process_user_message(self, user_id: int, message: str, conversation_id: str = None) -> Dict[str, Any]:
        """
        Process a user message and return the AI response (synchronous wrapper)
        """
        return asyncio.run(self.process_user_message_async(user_id, message, conversation_id))

    def _get_or_create_conversation(self, user_id: int, conversation_id: str = None) -> Conversation:
        """
        Get existing conversation or create a new one
        """
        with Session(engine) as session:
            if conversation_id:
                conversation = session.exec(
                    select(Conversation).where(Conversation.id == int(conversation_id), Conversation.user_id == user_id)
                ).first()
                if conversation:
                    return conversation

            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
            return conversation

    def _store_message(self, user_id: int, conversation_id: int, content: str, role: MessageRole):
        """
        Store a message in the database
        """
        with Session(engine) as session:
            message = Message(
                conversation_id=conversation_id,
                role=role,
                content=content,
                user_id=user_id
            )
            session.add(message)
            session.commit()

    def _get_conversation_history(self, conversation_id: int, limit: int = 20) -> List[Dict[str, str]]:
        """
        Get conversation history from the database
        """
        with Session(engine) as session:
            messages = session.exec(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at.desc())
                .limit(limit)
            ).all()

            history = []
            for msg in reversed(messages):
                history.append({
                    "role": msg.role.value,
                    "content": msg.content
                })

            return history
