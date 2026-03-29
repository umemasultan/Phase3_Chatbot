"""
MCP Client for connecting to the MCP server from the AI agent
"""
import asyncio
import json
from typing import Dict, Any, Optional
# Note: Not importing OpenAI here to avoid API key requirement during initialization
# Note: Not importing actual MCP client for now since we're using mock implementation
# from mcp.client import ClientSession
# from mcp.types import Tool

class MCPTodoClient:
    def __init__(self):
        # Don't initialize OpenAI client during initialization to avoid API key requirement
        # In a real implementation, we would connect to the MCP server here
        # For now, we'll create a mock implementation that mimics the MCP tools
        self.tools = {
            "add_task": self._add_task_impl,
            "list_tasks": self._list_tasks_impl,
            "complete_task": self._complete_task_impl,
            "delete_task": self._delete_task_impl,
            "update_task": self._update_task_impl
        }

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call an MCP tool with the given arguments
        """
        if tool_name not in self.tools:
            return {
                "error": f"Tool {tool_name} not found",
                "success": False
            }

        try:
            # Call the corresponding tool implementation
            result = await self.tools[tool_name](arguments)
            return result
        except Exception as e:
            return {
                "error": str(e),
                "success": False
            }

    async def _add_task_impl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of add_task tool
        """
        try:
            from sqlmodel import Session
            from db.database import engine
            from models.task import Task

            user_id = args.get('user_id')
            title = args.get('title', 'Untitled')
            description = args.get('description', '')

            with Session(engine) as session:
                # Create new task
                new_task = Task(
                    user_id=user_id,
                    title=title,
                    description=description,
                    status="pending"
                )
                session.add(new_task)
                session.commit()
                session.refresh(new_task)

                return {
                    "success": True,
                    "task_id": new_task.id,
                    "message": f"Task '{title}' added successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to add task: {str(e)}"
            }

    async def _list_tasks_impl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of list_tasks tool
        """
        try:
            from sqlmodel import Session, select
            from db.database import engine
            from models.task import Task

            user_id = args.get('user_id')
            status_filter = args.get('status')

            with Session(engine) as session:
                query = select(Task).where(Task.user_id == user_id)

                if status_filter:
                    query = query.where(Task.status == status_filter)

                tasks = session.exec(query).all()

                task_list = []
                for task in tasks:
                    task_list.append({
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "status": task.status,
                        "created_at": task.created_at.isoformat() if task.created_at else None,
                        "updated_at": task.updated_at.isoformat() if task.updated_at else None
                    })

                return {
                    "success": True,
                    "tasks": task_list,
                    "message": f"Found {len(task_list)} task(s)"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to list tasks: {str(e)}"
            }

    async def _complete_task_impl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of complete_task tool
        """
        try:
            from sqlmodel import Session, select
            from db.database import engine
            from models.task import Task

            user_id = args.get('user_id')
            task_id = args.get('task_id')

            with Session(engine) as session:
                task = session.exec(
                    select(Task).where(Task.id == task_id, Task.user_id == user_id)
                ).first()

                if not task:
                    return {
                        "success": False,
                        "message": f"Task {task_id} not found"
                    }

                # Toggle completion status
                task.status = "completed" if task.status != "completed" else "pending"
                session.add(task)
                session.commit()

                return {
                    "success": True,
                    "message": f"Task '{task.title}' marked as {task.status}"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to complete task: {str(e)}"
            }

    async def _delete_task_impl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of delete_task tool
        """
        try:
            from sqlmodel import Session, select
            from db.database import engine
            from models.task import Task

            user_id = args.get('user_id')
            task_id = args.get('task_id')

            with Session(engine) as session:
                task = session.exec(
                    select(Task).where(Task.id == task_id, Task.user_id == user_id)
                ).first()

                if not task:
                    return {
                        "success": False,
                        "message": f"Task {task_id} not found"
                    }

                task_title = task.title
                session.delete(task)
                session.commit()

                return {
                    "success": True,
                    "message": f"Task '{task_title}' deleted successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to delete task: {str(e)}"
            }

    async def _update_task_impl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Implementation of update_task tool
        """
        try:
            from sqlmodel import Session, select
            from db.database import engine
            from models.task import Task

            user_id = args.get('user_id')
            task_id = args.get('task_id')
            title = args.get('title')
            description = args.get('description')
            status = args.get('status')

            with Session(engine) as session:
                task = session.exec(
                    select(Task).where(Task.id == task_id, Task.user_id == user_id)
                ).first()

                if not task:
                    return {
                        "success": False,
                        "message": f"Task {task_id} not found"
                    }

                # Update fields if provided
                if title:
                    task.title = title
                if description:
                    task.description = description
                if status:
                    task.status = status

                session.add(task)
                session.commit()

                return {
                    "success": True,
                    "message": f"Task '{task.title}' updated successfully"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to update task: {str(e)}"
            }

    def get_tool_definitions(self) -> list:
        """
        Get tool definitions in OpenAI format for function calling
        """
        return [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "title": {"type": "string", "description": "Task title"},
                            "description": {"type": "string", "description": "Task description"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "status": {"type": "string", "description": "Filter by task status (optional)"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Complete a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to complete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to delete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to update"},
                            "title": {"type": "string", "description": "New task title (optional)"},
                            "description": {"type": "string", "description": "New task description (optional)"},
                            "status": {"type": "string", "description": "New task status (optional)"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]