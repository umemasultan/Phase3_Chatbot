from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from passlib.context import CryptContext

if TYPE_CHECKING:
    from .task import Task
    from .conversation import Conversation

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str

class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships to tasks and conversations
    tasks: list["Task"] = Relationship(back_populates="user")
    conversations: list["Conversation"] = Relationship(back_populates="user")

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.hashed_password)

class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

class UserCreate(UserBase):
    password: str

class UserLogin(SQLModel):
    email: str
    password: str