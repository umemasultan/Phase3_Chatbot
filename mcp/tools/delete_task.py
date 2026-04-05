"""
MCP Tool for deleting a task
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


class DeleteTaskRequest(BaseModel):
    user_id: int = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID to delete")


class DeleteTaskResult(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Result message")


@server.tool(
    "delete_task",
    description="Delete a task for the user",
    parameters=DeleteTaskRequest,
    returns=DeleteTaskResult,
)
def delete_task(request: DeleteTaskRequest) -> DeleteTaskResult:
    """
    Delete a specific task for the specified user
    """
    try:
        with Session(engine) as session:
            # Find the task
            task = session.exec(select(Task).where(Task.id == request.task_id, Task.user_id == request.user_id)).first()

            if not task:
                return DeleteTaskResult(
                    success=False,
                    message=f"Task with ID {request.task_id} not found for user {request.user_id}"
                )

            # Delete the task
            session.delete(task)
            session.commit()

            return DeleteTaskResult(
                success=True,
                message=f"Task '{task.title}' deleted successfully"
            )
    except Exception as e:
        return DeleteTaskResult(
            success=False,
            message=f"Error deleting task: {str(e)}"
        )