"""
MCP Tool for updating a task
"""
from mcp.server import server
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from backend.src.models.task import Task, TaskStatus
from backend.src.db.database import engine
import sys
import os

# Add the project root to the path so we can import backend modules
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


class UpdateTaskRequest(BaseModel):
    user_id: int = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID to update")
    title: str = Field(default=None, description="New task title (optional)")
    description: str = Field(default=None, description="New task description (optional)")
    status: str = Field(default=None, description="New task status (optional)")


class UpdateTaskResult(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Result message")


@server.tool(
    "update_task",
    description="Update a task for the user",
    parameters=UpdateTaskRequest,
    returns=UpdateTaskResult,
)
def update_task(request: UpdateTaskRequest) -> UpdateTaskResult:
    """
    Update a specific task for the specified user
    """
    try:
        with Session(engine) as session:
            # Find the task
            task = session.exec(select(Task).where(Task.id == request.task_id, Task.user_id == request.user_id)).first()

            if not task:
                return UpdateTaskResult(
                    success=False,
                    message=f"Task with ID {request.task_id} not found for user {request.user_id}"
                )

            # Update fields if provided
            if request.title is not None:
                task.title = request.title
            if request.description is not None:
                task.description = request.description
            if request.status is not None:
                # Convert string status to TaskStatus enum
                try:
                    task.status = TaskStatus(request.status)
                except ValueError:
                    return UpdateTaskResult(
                        success=False,
                        message=f"Invalid status: {request.status}. Valid values: {list(TaskStatus)}"
                    )

            session.add(task)
            session.commit()

            return UpdateTaskResult(
                success=True,
                message=f"Task '{task.title}' updated successfully"
            )
    except Exception as e:
        return UpdateTaskResult(
            success=False,
            message=f"Error updating task: {str(e)}"
        )