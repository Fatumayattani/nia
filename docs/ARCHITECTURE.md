# Nia Architecture

## System Overview

Nia is a web-based voice AI agent for financial management consisting of three main components:

1. **Frontend (React)** - User-facing web interface
2. **Backend (FastAPI)** - API server and business logic
3. **Database (PostgreSQL)** - Data persistence

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Frontend Application                 │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Components: Login, Dashboard, Chat, Voice     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Services: API Client, Audio Recorder          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Hooks: useAuth, useChat                       │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ State: Zustand Store                          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/WebSocket
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend Server                     │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes Layer                                           │ │
│  │ ├─ /api/users/* (Auth, Profile)                       │ │
│  │ ├─ /api/chat/* (Messages, Voice)                      │ │
│  │ └─ /health, /docs                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Services Layer                                         │ │
│  │ ├─ AIService (OpenAI Integration)                    │ │
│  │ │  ├─ generate_advice()                              │ │
│  │ │  └─ transcribe_audio()                             │ │
│  │ ├─ UserService (User Management)                     │ │
│  │ │  ├─ create_user()                                  │ │
│  │ │  ├─ get_user()                                     │ │
│  │ │  └─ verify_password()                              │ │
│  │ └─ Database Service                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Database Layer (SQLAlchemy ORM)                       │ │
│  │ ├─ Models: User, FinancialData, ConversationHistory  │ │
│  │ └─ Session Management                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                      PostgreSQL
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────┤
│  ├─ users table                                             │
│  ├─ financial_data table                                    │
│  └─ conversation_history table                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow
```
User Input → React Form → API Call → UserService → Database ← Response
```

### Chat Message Flow
```
User Message → Text/Voice Input → API Endpoint → AIService 
→ OpenAI API → Generate Response → Store in DB → Return to Frontend
```

### Voice Input Flow
```
Microphone → Audio Blob → Base64 Encode → Send to Backend 
→ Whisper API → Transcribe → Chat Flow
```

## Component Structure

### Frontend Components

```
App.tsx
├── LoginPage
│   ├── Email Input
│   ├── Password Input
│   └── Sign Up Toggle
├── DashboardPage
│   ├── ChatWindow
│   │   └── MessageBubbles
│   ├── TextInput
│   ├── VoiceInput
│   │   ├── Start Recording Button
│   │   └── Stop Recording Button
│   └── Profile Sidebar
│       └── User Information
└── ProtectedRoute
```

### Backend Routes

```
/api
├── /users
│   ├── POST /register
│   ├── POST /login
│   ├── GET /{user_id}
│   └── PUT /{user_id}
├── /chat
│   ├── POST /message
│   ├── POST /voice
│   └── GET /history/{user_id}
├── /health
└── /docs
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    monthly_income FLOAT,
    monthly_expenses FLOAT,
    financial_goals VARCHAR,
    risk_tolerance VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Financial Data Table
```sql
CREATE TABLE financial_data (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    transaction_type VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    description VARCHAR,
    date TIMESTAMP,
    created_at TIMESTAMP
);
```

### Conversation History Table
```sql
CREATE TABLE conversation_history (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    created_at TIMESTAMP
);
```

## AI Integration

### OpenAI Services Used

1. **GPT-3.5-turbo** - Chat completions for financial advice
   - System prompt ensures financial expertise
   - Conversation history for context
   - Temperature 0.7 for balanced responses

2. **Whisper API** - Audio transcription
   - Converts voice input to text
   - Supports multiple languages
   - Used before chat processing

## State Management

### Zustand Store Structure
```typescript
interface AppState {
  user: User | null
  isAuthenticated: boolean
  chatHistory: ChatMessage[]
  isLoading: boolean
  error: string | null
  // ... state setter methods
}
```

## Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. Returns user data
4. Frontend stores user ID in localStorage
5. User ID used for all subsequent requests
6. Logout clears localStorage and resets state

## Security Considerations

### Current Implementation
- Password hashing (SHA-256)
- CORS protection
- Input validation via Pydantic
- SQL injection protection (SQLAlchemy ORM)

### Recommended Improvements
- Upgrade to bcrypt for password hashing
- Implement JWT tokens with expiration
- Add rate limiting
- Implement 2FA
- Add encryption for sensitive data
- Use HTTPS in production

## Performance Optimizations

### Frontend
- Component memoization
- Lazy loading routes
- Efficient state management
- Audio compression

### Backend
- Database connection pooling
- Query optimization
- Response caching
- Async/await for I/O operations

## Scalability Considerations

- Horizontal scaling with load balancer
- Database replication for reads
- Message queue for async tasks
- CDN for static assets
- Microservices architecture (future)

## API Response Format

### Success Response
```json
{
  "response": "Financial advice message",
  "advice": {
    "advice": "Specific recommendation",
    "category": "Budgeting",
    "confidence": 0.95,
    "sources": []
  }
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```
