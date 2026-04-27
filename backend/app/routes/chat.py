"""Chat routes for voice AI interaction."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..schemas import ChatRequest, ChatResponse, VoiceInput
from ..services.ai_service import AIService
from ..db import get_db
from ..models.user import User, ConversationHistory

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """Send a message and get financial advice."""
    
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get conversation history
    history = db.query(ConversationHistory).filter(
        ConversationHistory.user_id == request.user_id
    ).order_by(ConversationHistory.created_at.desc()).limit(10).all()
    
    conversation_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in reversed(history)
    ]
    
    # Prepare user context
    user_context = {
        "monthly_income": user.monthly_income,
        "monthly_expenses": user.monthly_expenses,
        "risk_tolerance": user.risk_tolerance,
        "financial_goals": user.financial_goals,
    }
    
    # Generate response
    ai_response = await AIService.generate_advice(
        user_message=request.message,
        conversation_history=conversation_messages,
        user_context=user_context,
    )
    
    # Store in conversation history
    user_msg = ConversationHistory(
        user_id=request.user_id,
        role="user",
        content=request.message
    )
    assistant_msg = ConversationHistory(
        user_id=request.user_id,
        role="assistant",
        content=ai_response
    )
    
    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()
    
    return ChatResponse(response=ai_response)


@router.post("/voice")
async def send_voice(
    request: VoiceInput,
    user_id: str = Query(...),
    db: Session = Depends(get_db)
):
    """Send a voice message and get response."""
    
    import base64
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Decode audio
    audio_data = base64.b64decode(request.audio_base64)
    
    # Transcribe
    transcribed_text = await AIService.transcribe_audio(audio_data)
    
    if transcribed_text.startswith("Transcription failed"):
        raise HTTPException(status_code=400, detail=transcribed_text)
    
    # Generate advice based on transcribed text
    chat_request = ChatRequest(message=transcribed_text, user_id=user_id)
    
    return await send_message(chat_request, db)


@router.get("/history/{user_id}")
async def get_chat_history(
    user_id: str,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    """Get chat history for a user."""
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    history = db.query(ConversationHistory).filter(
        ConversationHistory.user_id == user_id
    ).order_by(ConversationHistory.created_at.desc()).limit(limit).all()
    
    return [
        {
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at
        }
        for msg in reversed(history)
    ]
