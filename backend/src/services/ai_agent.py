"""
AI Agent Service for Todo Chatbot
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
from services.mcp_client import MCPTodoClient


class AIAgentService:
    def __init__(self):
        # Initialize MCP client to connect to our tools
        self.mcp_client = MCPTodoClient()

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

    def create_agent(self, conversation_history: List[Dict[str, str]] = None) -> Any:
        """
        Create an OpenAI agent with MCP tools
        """
        # Prepare the messages for the agent
        messages = []
        if conversation_history:
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

        # Add system message with instructions for the AI
        system_message = {
            "role": "system",
            "content": """
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
        }

        if not messages or messages[0]["role"] != "system":
            messages.insert(0, system_message)

        return messages

    async def process_user_message_async(self, user_id: int, message: str, conversation_id: str = None) -> Dict[str, Any]:
        """
        Process a user message asynchronously and return the AI response
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
                # Get conversation history for context, even if minimal
                conversation_history = self._get_conversation_history(conversation.id)
                ai_response = self._get_simple_response(message)
                # Store the response and return early
                self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)
                return {
                    "response": ai_response,
                    "conversation_id": str(conversation.id),
                    "message_id": "temp_id"  # In a real implementation, this would be the actual message ID
                }

            # Get conversation history for the agent
            conversation_history = self._get_conversation_history(conversation.id)

            # Create agent with conversation history
            agent_messages = self.create_agent(conversation_history)
            agent_messages.append({"role": "user", "content": message})

            # Get tool definitions for function calling
            tools = self.mcp_client.get_tool_definitions()

            # Use OpenAI API to get response with tools
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_api_key)
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=agent_messages,
                    tools=tools,
                    tool_choice="auto"
                )
            except Exception as openai_error:
                # Handle OpenAI API errors
                error_msg = f"Error with OpenAI API: {str(openai_error)}"
                print(error_msg)  # Log the error
                # Before returning the error, try to provide a helpful fallback response
                # based on the original message if OpenAI is unavailable
                ai_response = self._get_simple_response(message)
                # Store the response
                self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)
                return {
                    "response": ai_response,
                    "conversation_id": str(conversation.id) if conversation else "new",
                    "message_id": "temp_id",
                    "error": str(openai_error)
                }

            # Handle tool calls if present
            response_message = response.choices[0].message
            tool_calls = response_message.tool_calls

            ai_response = ""

            if tool_calls:
                # Add the tool calls to the conversation
                agent_messages.append(response_message)

                # Execute each tool call
                for tool_call in tool_calls:
                    function_name = tool_call.function.name
                    try:
                        function_args = eval(tool_call.function.arguments)  # In production, use json.loads
                    except Exception as args_error:
                        error_msg = f"Error parsing function arguments: {str(args_error)}"
                        print(error_msg)  # Log the error
                        agent_messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": f'{{"error": "{error_msg}"}}'
                        })
                        continue

                    # Add the user_id to the arguments if not already present
                    if "user_id" not in function_args:
                        function_args["user_id"] = user_id

                    # For destructive operations, we should confirm with the user first
                    # For now, we'll execute them directly but in a full implementation,
                    # we would check if the tool is destructive and confirm with the user
                    if function_name in ["delete_task", "complete_task"]:
                        # In a full implementation, we would ask for user confirmation before executing
                        # For now, we'll just proceed with the operation
                        pass

                    try:
                        # Call the tool
                        tool_result = await self.mcp_client.call_tool(function_name, function_args)

                        # Add the result to the conversation
                        agent_messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": str(tool_result)
                        })
                    except Exception as tool_error:
                        error_msg = f"Error executing tool {function_name}: {str(tool_error)}"
                        print(error_msg)  # Log the error
                        agent_messages.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": f'{{"error": "{error_msg}", "success": false}}'
                        })

                # Import and create OpenAI client only when needed and with API key
                import os
                from core.config import settings
                openai_api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
                try:
                    if openai_api_key:
                        from openai import OpenAI
                        client = OpenAI(api_key=openai_api_key)
                        # Get the final response from the assistant
                        final_response = client.chat.completions.create(
                            model="gpt-3.5-turbo",
                            messages=agent_messages
                        )
                        ai_response = final_response.choices[0].message.content
                    else:
                        # If no API key, we shouldn't reach this point in the flow since
                        # we handle it earlier, but just in case
                        ai_response = "I processed your request but need an API key to generate a detailed response."
                except Exception as final_response_error:
                    error_msg = f"Error getting final response from AI: {str(final_response_error)}"
                    print(error_msg)  # Log the error
                    ai_response = "I processed your request but encountered an issue forming a complete response."
            else:
                # No tools were called, use the initial response
                ai_response = response_message.content if response_message.content else "I received your message but couldn't process it. Could you please rephrase?"

            # Store AI response
            self._store_message(user_id, conversation.id, ai_response, MessageRole.assistant)

            return {
                "response": ai_response,
                "conversation_id": str(conversation.id),
                "message_id": "temp_id"  # In a real implementation, this would be the actual message ID
            }
        except Exception as e:
            return {
                "response": f"Sorry, I encountered an error processing your request: {str(e)}",
                "conversation_id": conversation_id or "new",
                "message_id": None,
                "error": str(e)
            }

    def _get_simple_response(self, message: str) -> str:
        """
        Provide a simple response when OpenAI API is not configured
        """
        message_lower = message.lower()
        if any(keyword in message_lower for keyword in ['add', 'create', 'new', 'remember', 'buy groceries']):
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
        # Run the async function in a new event loop
        import asyncio
        return asyncio.run(self.process_user_message_async(user_id, message, conversation_id))

    def _get_or_create_conversation(self, user_id: int, conversation_id: str = None) -> Conversation:
        """
        Get existing conversation or create a new one
        """
        with Session(engine) as session:
            if conversation_id:
                # Try to get existing conversation
                conversation = session.exec(
                    select(Conversation).where(Conversation.id == int(conversation_id), Conversation.user_id == user_id)
                ).first()
                if conversation:
                    return conversation

            # Create new conversation
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
            # Create message instance with all required fields
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
            # Get the most recent messages for the conversation
            messages = session.exec(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at.desc())
                .limit(limit)
            ).all()

            # Convert to the format expected by the agent (reversed to maintain chronological order)
            history = []
            for msg in reversed(messages):
                history.append({
                    "role": msg.role.value,
                    "content": msg.content
                })

            return history