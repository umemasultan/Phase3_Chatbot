











"""
MCP Tool for adding a new task
"""
from mcp.server import server
from pydantic import BaseModel, Field
from sqlmodel import Session
import sys
import os

# Add the project root to the path so we can import backend modules
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.src.models.task import Task
from backend.src.db.database import engine

class AddTaskRequest(BaseModel):
    user_id: int = Field(..., description="User ID")
    title: str = Field(..., description="Task title")
    description: str = Field(default=None, description="Task description")


class AddTaskResult(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    task_id: int = Field(..., description="ID of the created task")
    message: str = Field(..., description="Result message")


@server.tool(
    "add_task",
    description="Add a new task for the user",
    parameters=AddTaskRequest,
    returns=AddTaskResult,
)
def add_task(request: AddTaskRequest) -> AddTaskResult:
    """
    Add a new task for the specified user
    """
    try:
        with Session(engine) as session:
            # Create the task
            task = Task(
                title=request.title,
                description=request.description,
                user_id=request.user_id
            )

            session.add(task)
            session.commit()
            session.refresh(task)

            return AddTaskResult(
                success=True,
                task_id=task.id,
                message=f"Task '{task.title}' added successfully"
            )
    except Exception as e:
        return AddTaskResult(
            success=False,
            task_id=-1,
            message=f"Error adding task: {str(e)}"
        )