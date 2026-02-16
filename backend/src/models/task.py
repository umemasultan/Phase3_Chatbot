from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import enum

class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: TaskStatus = Field(default=TaskStatus.pending)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Foreign key to link task to user
    user_id: int = Field(foreign_key="users.id")

    # Relationship to user
    user: "User" = Relationship(back_populates="tasks")

class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[TaskStatus] = None