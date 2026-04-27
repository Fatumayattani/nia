"""User model."""

from sqlalchemy import Column, String, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    """User model for storing user information."""
    
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    monthly_income = Column(Float, nullable=True)
    monthly_expenses = Column(Float, nullable=True)
    financial_goals = Column(String, nullable=True)  # JSON string
    risk_tolerance = Column(String, nullable=True)  # low, medium, high
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<User {self.email}>"


class FinancialData(Base):
    """Financial transaction/data model."""
    
    __tablename__ = "financial_data"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    transaction_type = Column(String)  # income, expense, investment
    category = Column(String)
    amount = Column(Float)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<FinancialData {self.user_id}>"


class ConversationHistory(Base):
    """Store conversation history for context."""
    
    __tablename__ = "conversation_history"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    role = Column(String)  # user, assistant
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<ConversationHistory {self.user_id}>"
