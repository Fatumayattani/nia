"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    risk_tolerance: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema."""
    password: str


class UserResponse(UserBase):
    """User response schema."""
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class FinancialDataCreate(BaseModel):
    """Financial data creation schema."""
    transaction_type: str  # income, expense, investment
    category: str
    amount: float
    description: Optional[str] = None


class FinancialDataResponse(FinancialDataCreate):
    """Financial data response schema."""
    id: str
    user_id: str
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class VoiceInput(BaseModel):
    """Voice input schema."""
    audio_base64: str
    language: str = "en"


class FinancialAdvice(BaseModel):
    """Financial advice response."""
    advice: str
    category: str
    confidence: float
    sources: List[str] = []


class ConversationMessage(BaseModel):
    """Conversation message."""
    role: str  # user, assistant
    content: str


class ChatRequest(BaseModel):
    """Chat request schema."""
    message: str
    user_id: str


class ChatResponse(BaseModel):
    """Chat response schema."""
    response: str
    advice: Optional[FinancialAdvice] = None
