"""AI service for financial advice."""

import openai
from typing import Optional, List
from ..config import settings

openai.api_key = settings.OPENAI_API_KEY

SYSTEM_PROMPT = """You are Nia, a knowledgeable and empathetic financial AI advisor. 
Your role is to help users manage money and make smarter financial decisions.

When providing advice:
1. Be clear and concise
2. Consider the user's risk tolerance and financial goals
3. Provide actionable recommendations
4. Ask clarifying questions when needed
5. Always emphasize that you're not a licensed financial advisor
6. Suggest consulting with professionals for major decisions

Focus on practical financial management, budgeting, savings strategies, 
investment basics, debt management, and financial planning."""


class AIService:
    """Service for AI-powered financial advice."""
    
    @staticmethod
    async def generate_advice(
        user_message: str,
        conversation_history: Optional[List[dict]] = None,
        user_context: Optional[dict] = None,
    ) -> str:
        """
        Generate financial advice using OpenAI.
        
        Args:
            user_message: The user's message
            conversation_history: Previous conversation messages
            user_context: User's financial context
        
        Returns:
            Financial advice as string
        """
        try:
            # Build messages
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT}
            ]
            
            # Add user context if available
            if user_context:
                context_str = _format_user_context(user_context)
                messages.append({
                    "role": "system",
                    "content": f"User's financial context:\n{context_str}"
                })
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history[-10:])  # Last 10 messages
            
            # Add current message
            messages.append({"role": "user", "content": user_message})
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=500,
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
    
    @staticmethod
    async def transcribe_audio(audio_data: bytes) -> str:
        """
        Transcribe audio to text using OpenAI Whisper.
        
        Args:
            audio_data: Audio data as bytes
        
        Returns:
            Transcribed text
        """
        try:
            import tempfile
            
            # Save audio to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp.write(audio_data)
                tmp_path = tmp.name
            
            # Transcribe
            with open(tmp_path, "rb") as audio_file:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file
                )
            
            # Clean up
            import os
            os.unlink(tmp_path)
            
            return transcript["text"]
        
        except Exception as e:
            return f"Transcription failed: {str(e)}"


def _format_user_context(context: dict) -> str:
    """Format user context for the AI prompt."""
    lines = []
    
    if context.get("monthly_income"):
        lines.append(f"- Monthly Income: ${context['monthly_income']}")
    
    if context.get("monthly_expenses"):
        lines.append(f"- Monthly Expenses: ${context['monthly_expenses']}")
    
    if context.get("risk_tolerance"):
        lines.append(f"- Risk Tolerance: {context['risk_tolerance']}")
    
    if context.get("financial_goals"):
        lines.append(f"- Financial Goals: {context['financial_goals']}")
    
    return "\n".join(lines) if lines else "No context provided"
