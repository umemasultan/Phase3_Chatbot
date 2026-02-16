from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
try:
    # Try relative imports first (when run as a module)
    from ..models.task import Task, TaskRead, TaskUpdate, TaskCreate, TaskStatus
    from ..models.user import User
    from ..db.database import get_session
    from ..auth.jwt_handler import get_current_user, get_current_user_email
except ImportError:
    # Fall back to absolute imports (when run directly)
    from models.task import Task, TaskRead, TaskUpdate, TaskCreate, TaskStatus
    from models.user import User
    from db.database import get_session
    from auth.jwt_handler import get_current_user, get_current_user_email

router = APIRouter(prefix="/api", tags=["tasks"])

@router.get("/{user_id}/tasks", response_model=List[TaskRead])
def read_tasks(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only access their own tasks
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access these tasks")

    # Build query with user ID
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status_filter:
        try:
            task_status = TaskStatus(status_filter)
            query = query.where(Task.status == task_status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status filter")

    tasks = session.exec(query.offset(skip).limit(limit)).all()
    return tasks

@router.post("/{user_id}/tasks", response_model=TaskRead)
def create_task(
    user_id: int,
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only create tasks for themselves
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create tasks for this user")

    # Validate title length according to spec
    if not task.title or len(task.title.strip()) < 1 or len(task.title) > 200:
        raise HTTPException(status_code=400, detail="Title must be 1-200 characters")

    # Validate description length according to spec
    if task.description and len(task.description) > 1000:
        raise HTTPException(status_code=400, detail="Description must be at most 1000 characters")

    db_task = Task(**task.model_dump(), user_id=user_id)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def read_task(
    user_id: int,
    task_id: int,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only access their own tasks
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access these tasks")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: int,
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only update their own tasks
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update these tasks")

    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    # Validate title length if provided
    if task_update.title is not None:
        if len(task_update.title.strip()) < 1 or len(task_update.title) > 200:
            raise HTTPException(status_code=400, detail="Title must be 1-200 characters")

    # Validate description length if provided
    if task_update.description and len(task_update.description) > 1000:
        raise HTTPException(status_code=400, detail="Description must be at most 1000 characters")

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: int,
    task_id: int,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only delete their own tasks
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete these tasks")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}

@router.patch("/{user_id}/tasks/{task_id}/complete")
def toggle_task_completion(
    user_id: int,
    task_id: int,
    session: Session = Depends(get_session),
    current_user_email: str = Depends(get_current_user_email)
):
    # Get current user by email to check authorization
    current_user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure user can only update their own tasks
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update these tasks")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    # Toggle task status between pending and completed
    if task.status == TaskStatus.completed:
        task.status = TaskStatus.pending
    else:
        task.status = TaskStatus.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return {"message": "Task completion toggled", "task": task}