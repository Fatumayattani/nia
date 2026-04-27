"""User management routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas import UserCreate, UserResponse
from ..services.user_service import UserService
from ..db import get_db

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user."""
    
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create user
    user = UserService.create_user(
        db,
        email=user_data.email,
        name=user_data.name,
        password=user_data.password
    )
    
    return user


@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Login user."""
    
    user = UserService.get_user_by_email(db, email)
    if not user or not UserService.verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return {
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "message": "Login successful"
    }


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get user profile."""
    
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_data: dict,
    db: Session = Depends(get_db)
):
    """Update user profile."""
    
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Filter out None values
    update_data = {k: v for k, v in user_data.items() if v is not None}
    
    user = UserService.update_user(db, user, **update_data)
    
    return user
