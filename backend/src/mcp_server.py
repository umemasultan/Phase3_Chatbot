"""
Official MCP Server for Todo Task Management
Uses the official MCP SDK to expose task operations as tools
"""
import asyncio
import sys
import os
from typing import Any

# Add the src directory to the path to allow absolute imports
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
from sqlmodel import Session, select
from models.task import Task
from db.database import engine


# Create MCP server instance
app = Server("todo-mcp-server")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """
    List all available MCP tools for task management
    """
    return [
        Tool(
            name="add_task",
            description="Create a new task for the user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "title": {
                        "type": "string",
                        "description": "Task title"
                    },
                    "description": {
                        "type": "string",
                        "description": "Task description (optional)"
                    }
                },
                "required": ["user_id", "title"]
            }
        ),
        Tool(
            name="list_tasks",
            description="List all tasks for the user with optional status filter",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "status": {
                        "type": "string",
                        "description": "Filter by task status: pending, in-progress, completed, or all",
                        "enum": ["pending", "in-progress", "completed", "all"]
                    }
                },
                "required": ["user_id"]
            }
        ),
        Tool(
            name="complete_task",
            description="Mark a task as complete",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to complete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        ),
        Tool(
            name="delete_task",
            description="Delete a task from the user's list",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to delete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        ),
        Tool(
            name="update_task",
            description="Update a task's title, description, or status",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "User ID"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "Task ID to update"
                    },
                    "title": {
                        "type": "string",
                        "description": "New task title (optional)"
                    },
                    "description": {
                        "type": "string",
                        "description": "New task description (optional)"
                    },
                    "status": {
                        "type": "string",
                        "description": "New task status (optional)",
                        "enum": ["pending", "in-progress", "completed"]
                    }
                },
                "required": ["user_id", "task_id"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """
    Handle tool calls from the MCP client
    """
    try:
        if name == "add_task":
            result = await add_task_impl(arguments)
        elif name == "list_tasks":
            result = await list_tasks_impl(arguments)
        elif name == "complete_task":
            result = await complete_task_impl(arguments)
        elif name == "delete_task":
            result = await delete_task_impl(arguments)
        elif name == "update_task":
            result = await update_task_impl(arguments)
        else:
            result = {"error": f"Unknown tool: {name}", "success": False}

        return [TextContent(type="text", text=str(result))]
    except Exception as e:
        return [TextContent(type="text", text=str({"error": str(e), "success": False}))]


async def add_task_impl(args: dict) -> dict:
    """
    Implementation of add_task tool
    """
    try:
        user_id = args.get('user_id')
        title = args.get('title', 'Untitled')
        description = args.get('description', '')

        with Session(engine) as session:
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
                "status": "created",
                "title": new_task.title,
                "message": f"Task '{title}' added successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to add task: {str(e)}"
        }


async def list_tasks_impl(args: dict) -> dict:
    """
    Implementation of list_tasks tool
    """
    try:
        user_id = args.get('user_id')
        status_filter = args.get('status')

        with Session(engine) as session:
            query = select(Task).where(Task.user_id == user_id)

            if status_filter and status_filter != "all":
                query = query.where(Task.status == status_filter)

            tasks = session.exec(query).all()

            task_list = []
            for task in tasks:
                task_list.append({
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status,
                    "completed": task.status == "completed",
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                })

            return {
                "success": True,
                "tasks": task_list,
                "count": len(task_list),
                "message": f"Found {len(task_list)} task(s)"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to list tasks: {str(e)}"
        }


async def complete_task_impl(args: dict) -> dict:
    """
    Implementation of complete_task tool
    """
    try:
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

            task.status = "completed"
            session.add(task)
            session.commit()

            return {
                "success": True,
                "task_id": task.id,
                "status": "completed",
                "title": task.title,
                "message": f"Task '{task.title}' marked as completed"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to complete task: {str(e)}"
        }


async def delete_task_impl(args: dict) -> dict:
    """
    Implementation of delete_task tool
    """
    try:
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
            task_id_deleted = task.id
            session.delete(task)
            session.commit()

            return {
                "success": True,
                "task_id": task_id_deleted,
                "status": "deleted",
                "title": task_title,
                "message": f"Task '{task_title}' deleted successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to delete task: {str(e)}"
        }


async def update_task_impl(args: dict) -> dict:
    """
    Implementation of update_task tool
    """
    try:
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
            if description is not None:
                task.description = description
            if status:
                task.status = status

            session.add(task)
            session.commit()

            return {
                "success": True,
                "task_id": task.id,
                "status": "updated",
                "title": task.title,
                "message": f"Task '{task.title}' updated successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to update task: {str(e)}"
        }


async def main():
    """
    Run the MCP server
    """
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
