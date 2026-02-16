from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
try:
    # Try relative imports first (when run as a module)
    from ..models.task import Task, TaskRead, TaskUpdate, TaskCreate
    from ..models.user import User
    from ..db.database import get_session
    from ..auth.jwt_handler import get_current_user
except ImportError:
    # Fall back to absolute imports (when run directly)
    from models.task import Task, TaskRead, TaskUpdate, TaskCreate
    from models.user import User
    from db.database import get_session
    from auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Use the user object directly since get_current_user returns the User object
    # Build query with user ID
    query = select(Task).where(Task.user_id == current_user.id)

    # Apply status filter if provided
    if status_filter:
        try:
            from ..models.task import TaskStatus
        except ImportError:
            from models.task import TaskStatus
        try:
            task_status = TaskStatus(status_filter)
            query = query.where(Task.status == task_status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status filter")

    tasks = session.exec(query.offset(skip).limit(limit)).all()
    return tasks

@router.get("/{task_id}", response_model=TaskRead)
def read_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    task = session.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Validate title length according to spec
    if not task.title or len(task.title.strip()) < 1 or len(task.title) > 200:
        raise HTTPException(status_code=400, detail="Title must be 1-200 characters")

    # Validate description length according to spec
    if task.description and len(task.description) > 1000:
        raise HTTPException(status_code=400, detail="Description must be at most 1000 characters")

    db_task = Task(**task.model_dump(), user_id=current_user.id)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != current_user.id:
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

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    task = session.get(Task, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}