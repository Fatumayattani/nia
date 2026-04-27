"""User service for user management."""

from sqlalchemy.orm import Session
from ..models.user import User
import hashlib
from typing import Optional


class UserService:
    """Service for user operations."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password."""
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def create_user(db: Session, email: str, name: str, password: str) -> User:
        """Create a new user."""
        user = User(
            email=email,
            name=name,
            password_hash=UserService.hash_password(password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify password."""
        return UserService.hash_password(password) == password_hash
    
    @staticmethod
    def update_user(db: Session, user: User, **kwargs) -> User:
        """Update user."""
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
