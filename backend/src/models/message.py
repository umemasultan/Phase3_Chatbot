from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import enum


class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"


class MessageBase(SQLModel):
    conversation_id: int = Field(foreign_key="conversations.id")
    role: MessageRole = Field(sa_column_kwargs={"default": MessageRole.user})
    content: str = Field(min_length=1, max_length=10000)


class Message(MessageBase, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")  # Store user_id for reference
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")


class MessageRead(MessageBase):
    id: int
    created_at: datetime


class MessageCreate(MessageBase):
    pass


# Update the forward reference after definition
Message.model_rebuild()