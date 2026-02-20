from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime


class ConversationBase(SQLModel):
    user_id: int = Field(foreign_key="users.id")


class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to user
    user: "User" = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")


class ConversationRead(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ConversationCreate(ConversationBase):
    pass


# Update the forward reference after definition
Conversation.model_rebuild()