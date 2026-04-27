"""FastAPI application factory."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import chat, users
from .db import init_db

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title="Nia - Financial AI Agent",
        description="Voice AI agent for financial management and advice",
        version="0.1.0"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Initialize database
    @app.on_event("startup")
    def startup():
        init_db()
    
    # Include routes
    app.include_router(users.router)
    app.include_router(chat.router)
    
    # Health check
    @app.get("/health")
    def health_check():
        return {"status": "healthy", "version": "0.1.0"}
    
    @app.get("/")
    def root():
        return {
            "message": "Welcome to Nia",
            "description": "Voice AI Agent for Financial Management",
            "docs": "/docs"
        }
    
    return app

app = create_app()
