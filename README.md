# Nia - Voice AI Agent for Financial Management

Nia is an intelligent voice AI agent that helps users manage money and make smarter financial decisions. It combines modern web technologies with AI-powered financial advice to provide personalized money management assistance.

## Features

- **Voice Input**: Speak naturally to Nia using voice commands
- **AI-Powered Advice**: Receive personalized financial guidance powered by OpenAI
- **Chat Interface**: Text-based conversation for quick questions
- **Financial Tracking**: Monitor income, expenses, and financial goals
- **Conversation History**: Keep track of all your financial discussions
- **User Profiles**: Customize your risk tolerance and financial goals

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: OpenAI API (GPT-3.5-turbo, Whisper)
- **Authentication**: JWT-based

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure

```
nia/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── services/       # Business logic services
│   │   ├── routes/         # API endpoints
│   │   ├── db/             # Database configuration
│   │   ├── config.py       # Application configuration
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   └── main.py         # FastAPI app factory
│   ├── main.py             # Server entry point
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Example environment variables
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and audio services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # React entry point
│   ├── index.html          # HTML entry point
│   ├── package.json        # Node dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite configuration
│
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration (especially DATABASE_URL and OPENAI_API_KEY)
```

5. Initialize the database:
```bash
python -c "from app.db import init_db; init_db()"
```

6. Start the server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/{user_id}` - Update user profile

### Chat
- `POST /api/chat/message` - Send a text message
- `POST /api/chat/voice` - Send a voice message
- `GET /api/chat/history/{user_id}` - Get chat history

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nia

# OpenAI API
OPENAI_API_KEY=your-api-key-here

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-here

# Server
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

## Usage Examples

### Text Chat
1. Register or login
2. Type a financial question in the chat box
3. Nia will respond with personalized advice

### Voice Chat
1. Click the microphone button
2. Speak your question
3. Nia will transcribe and respond to your voice

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm run test
```

### Type Checking

Frontend:
```bash
cd frontend
npm run type-check
```

### Linting

Frontend:
```bash
cd frontend
npm run lint
```

## Database Models

### User
- `id` - UUID primary key
- `email` - User email (unique)
- `name` - User name
- `password_hash` - Hashed password
- `monthly_income` - Optional income information
- `monthly_expenses` - Optional expense information
- `financial_goals` - JSON string of goals
- `risk_tolerance` - low, medium, or high
- `is_active` - Account status
- `created_at` - Account creation date
- `updated_at` - Last update date

### FinancialData
- `id` - UUID primary key
- `user_id` - Reference to user
- `transaction_type` - income, expense, or investment
- `category` - Transaction category
- `amount` - Transaction amount
- `description` - Optional description
- `date` - Transaction date
- `created_at` - Record creation date

### ConversationHistory
- `id` - UUID primary key
- `user_id` - Reference to user
- `role` - user or assistant
- `content` - Message content
- `created_at` - Message timestamp

## AI System Prompt

Nia operates with a comprehensive system prompt that ensures:
- Clear and concise financial advice
- Consideration of user's risk tolerance and goals
- Actionable recommendations
- Appropriate disclaimers about professional advice
- Focus on practical financial management

## Security Considerations

- Passwords are hashed using SHA-256 (upgrade to bcrypt in production)
- JWT tokens for session management
- CORS configured for frontend origin
- Environment variables for sensitive data
- SQL injection protection via SQLAlchemy ORM

## Future Enhancements

- [ ] Advanced financial analytics dashboard
- [ ] Integration with banking APIs
- [ ] Budget tracking and alerts
- [ ] Investment portfolio analysis
- [ ] Mobile app (React Native)
- [ ] Recurring transaction automation
- [ ] Multi-language support
- [ ] Advanced security features (2FA, encryption)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.

## Contact

For inquiries about Nia, please reach out through the repository issues.
