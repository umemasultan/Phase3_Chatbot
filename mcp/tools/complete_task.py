"""
MCP Tool for completing a task
"""
from mcp.server import server
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from backend.src.models.task import Task
from backend.src.db.database import engine
import sys
import os

# Add the project root to the path so we can import backend modules
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


class CompleteTaskRequest(BaseModel):
    user_id: int = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID to complete")


class CompleteTaskResult(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Result message")


@server.tool(
    "complete_task",
    description="Complete a task for the user",
    parameters=CompleteTaskRequest,
    returns=CompleteTaskResult,
)
def complete_task(request: CompleteTaskRequest) -> CompleteTaskResult:
    """
    Complete a specific task for the specified user
    """
    try:
        with Session(engine) as session:
            # Find the task
            task = session.exec(select(Task).where(Task.id == request.task_id, Task.user_id == request.user_id)).first()

            if not task:
                return CompleteTaskResult(
                    success=False,
                    message=f"Task with ID {request.task_id} not found for user {request.user_id}"
                )

            # Update the task status to completed
            from backend.src.models.task import TaskStatus
            task.status = TaskStatus.completed

            session.add(task)
            session.commit()

            return CompleteTaskResult(
                success=True,
                message=f"Task '{task.title}' marked as completed"
            )
    except Exception as e:
        return CompleteTaskResult(
            success=False,
            message=f"Error completing task: {str(e)}"
        )