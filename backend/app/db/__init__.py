"""Database configuration."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
from ..config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database."""
    Base.metadata.create_all(bind=engine)
