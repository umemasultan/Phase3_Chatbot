"""
Chat API Router for Todo AI Chatbot
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel
from sqlmodel import Session
import sys
import os

# Add the src directory to the path to allow absolute imports
src_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from services.ai_agent import AIAgentService
from models.message import MessageCreate
from db.database import get_session
from auth.jwt_handler import verify_token
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    message_id: Optional[str] = None


router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: int,
    request: ChatRequest,
    # session: Session = Depends(get_session),
    # token_data: dict = Depends(verify_token)
):
    """
    Send a message to the AI chatbot and get a response
    """
    try:
        # For now, bypassing token verification to test functionality
        # In production, uncomment the dependency to ensure authentication
        logger.info(f"Processing chat request for user_id: {user_id}")

        # Create AI agent service instance
        ai_service = AIAgentService()

        # Process the user message using the async method
        import asyncio
        result = await ai_service.process_user_message_async(user_id, request.message, request.conversation_id)

        # Convert to response model format
        return ChatResponse(
            response=result.get("response", "Sorry, I couldn't process your request"),
            conversation_id=result.get("conversation_id", str(user_id)),
            message_id=result.get("message_id")
        )
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        # Return a user-friendly error instead of 500
        return ChatResponse(
            response="I'm having trouble processing your request right now. Please try again later or use the task manager interface directly.",
            conversation_id=request.conversation_id or str(user_id),
            message_id=None
        )


@router.get("/{user_id}/conversations")
async def get_user_conversations(
    user_id: int,
    # session: Session = Depends(get_session),
    # token_data: dict = Depends(verify_token)
):
    """
    Get user's conversation history
    """
    try:
        # For now, bypassing token verification to test functionality
        logger.info(f"Fetching conversations for user_id: {user_id}")

        # In a real implementation, this would fetch from the database
        # Return a placeholder response
        return []
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")


@router.get("/{user_id}/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    user_id: int,
    conversation_id: str,
    # session: Session = Depends(get_session),
    # token_data: dict = Depends(verify_token)
):
    """
    Get messages in a specific conversation
    """
    try:
        # For now, bypassing token verification to test functionality
        logger.info(f"Fetching messages for user_id: {user_id}, conversation_id: {conversation_id}")

        # In a real implementation, this would fetch from the database
        # Return a placeholder response
        return []
    except Exception as e:
        logger.error(f"Error fetching conversation messages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching conversation messages: {str(e)}")