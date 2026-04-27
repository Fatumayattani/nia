# Nia - Setup and Development Guide

## Quick Start

### With Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd nia
```

2. Create a `.env` file:
```bash
cp backend/.env.example backend/.env
```

3. Update the `.env` file with your OpenAI API key:
```bash
# Edit backend/.env
OPENAI_API_KEY=sk-your-api-key-here
```

4. Start all services:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Setup

#### Backend

1. Set up Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Set up database:
```bash
# Make sure PostgreSQL is running
python -c "from app.db import init_db; init_db()"
```

4. Start backend:
```bash
python main.py
```

#### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## Database Setup

### PostgreSQL Installation

#### Ubuntu/Debian:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### macOS with Homebrew:
```bash
brew install postgresql
brew services start postgresql
```

#### Using Docker:
```bash
docker run --name nia-postgres \
  -e POSTGRES_USER=nia_user \
  -e POSTGRES_PASSWORD=nia_password \
  -e POSTGRES_DB=nia \
  -p 5432:5432 \
  -d postgres:15
```

### Create Database

```bash
psql -U postgres -c "CREATE USER nia_user WITH PASSWORD 'nia_password';"
psql -U postgres -c "CREATE DATABASE nia OWNER nia_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE nia TO nia_user;"
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Key Endpoints

#### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login

#### Chat
- `POST /api/chat/message` - Send text message
- `POST /api/chat/voice` - Send voice message
- `GET /api/chat/history/{user_id}` - Get conversation history

#### User
- `GET /api/users/{user_id}` - Get profile
- `PUT /api/users/{user_id}` - Update profile

## Development Workflow

### Frontend Development

Watch for file changes:
```bash
cd frontend
npm run dev
```

Type checking:
```bash
npm run type-check
```

Linting:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

### Backend Development

Run with auto-reload:
```bash
cd backend
python main.py
```

Access the API documentation at `http://localhost:8000/docs`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://nia_user:nia_password@localhost:5432/nia

# OpenAI API (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-key-here

# Security
JWT_SECRET=your-secret-key-change-in-production

# Server
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## Testing

### Backend Tests

```bash
cd backend
pip install pytest pytest-asyncio
pytest
```

### Frontend Tests

```bash
cd frontend
npm install --save-dev vitest
npm run test
```

## Deployment

### Docker Deployment

1. Build images:
```bash
docker-compose build
```

2. Run production containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### Backend
```bash
# Install as systemd service or use supervisor/pm2
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

#### Frontend
```bash
npm run build
# Serve dist folder with nginx or static server
npx serve -s dist -l 3000
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database and user are created

### OpenAI API Error
- Verify OPENAI_API_KEY is correct
- Check API key has sufficient quota
- Review OpenAI documentation for rate limits

### Microphone Permission Error
- Browser needs microphone permission
- Check browser console for specific error
- Some browsers require HTTPS for microphone access

### CORS Issues
- Verify frontend URL is in CORS_ORIGINS
- Check frontend makes requests to correct backend URL

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

MIT License
