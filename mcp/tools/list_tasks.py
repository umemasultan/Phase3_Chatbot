"""
MCP Tool for listing tasks
"""
from mcp.server import server
from pydantic import BaseModel, Field
from sqlmodel import Session, select
import sys
import os

# Add the project root to the path so we can import backend modules
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.src.models.task import Task
from backend.src.db.database import engine


class ListTasksRequest(BaseModel):
    user_id: int = Field(..., description="User ID")
    status: str = Field(default=None, description="Filter by task status (optional)")


class TaskItem(BaseModel):
    id: int
    title: str
    description: str = None
    status: str
    created_at: str
    updated_at: str


class ListTasksResult(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    tasks: list[TaskItem] = Field(..., description="List of tasks")
    message: str = Field(..., description="Result message")


@server.tool(
    "list_tasks",
    description="List all tasks for the user",
    parameters=ListTasksRequest,
    returns=ListTasksResult,
)
def list_tasks(request: ListTasksRequest) -> ListTasksResult:
    """
    List all tasks for the specified user
    """
    try:
        with Session(engine) as session:
            # Build query based on filters
            query = select(Task).where(Task.user_id == request.user_id)

            if request.status:
                query = query.where(Task.status == request.status)

            tasks_db = session.exec(query).all()

            # Convert to response format
            tasks = [
                TaskItem(
                    id=task.id,
                    title=task.title,
                    description=task.description,
                    status=task.status.value if hasattr(task.status, 'value') else str(task.status),
                    created_at=task.created_at.isoformat() if hasattr(task.created_at, 'isoformat') else str(task.created_at),
                    updated_at=task.updated_at.isoformat() if hasattr(task.updated_at, 'isoformat') else str(task.updated_at)
                )
                for task in tasks_db
            ]

            return ListTasksResult(
                success=True,
                tasks=tasks,
                message=f"Found {len(tasks)} tasks for user {request.user_id}"
            )
    except Exception as e:
        return ListTasksResult(
            success=False,
            tasks=[],
            message=f"Error listing tasks: {str(e)}"
        )