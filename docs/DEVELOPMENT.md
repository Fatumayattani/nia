# Nia Development Guide

## Getting Started for Developers

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git
- OpenAI API Key (from https://platform.openai.com/api-keys)

### First Time Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd nia
```

2. **Set up backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
python -c "from app.db import init_db; init_db()"
python main.py
```

3. **Set up frontend (in new terminal):**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
backend/
  app/
    models/      # Database models
    services/    # Business logic
    routes/      # API endpoints
    db/          # Database config
    main.py      # FastAPI app
  main.py        # Entry point

frontend/
  src/
    components/  # React components
    hooks/       # Custom hooks
    services/    # API clients
    types/       # TypeScript types
  vite.config.ts # Build config
```

## Key Features to Understand

### Frontend State Management
- Uses Zustand for global state
- `useAppStore()` for user and chat state
- `useAuth()` hook for authentication
- `useChat()` hook for messaging

### Backend Architecture
- FastAPI for HTTP API
- SQLAlchemy ORM for database
- OpenAI API integration
- Service layer for business logic

### Voice Processing
- Web Audio API for recording
- Base64 encoding for transmission
- Whisper API for transcription

## Common Tasks

### Adding a New API Endpoint

1. Create route in `backend/app/routes/`
2. Add service logic in `backend/app/services/`
3. Define schemas in `backend/app/schemas.py`
4. Test with http://localhost:8000/docs

### Adding a New Frontend Component

1. Create component in `frontend/src/components/`
2. Define types in `frontend/src/types/`
3. Use hooks for API calls
4. Style with Tailwind CSS

### Working with Database

1. Define model in `backend/app/models/user.py`
2. Sync with `python -c "from app.db import init_db; init_db()"`
3. Create migration if needed

## Testing

### Backend
```bash
cd backend
pip install pytest pytest-asyncio
pytest
```

### Frontend
```bash
cd frontend
npm install --save-dev vitest
npm test
```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Docstrings for functions
- Black formatter recommended

### TypeScript
- Strict mode enabled
- Use interfaces for types
- Clear component prop typing
- No implicit any

## Common Issues

### Port already in use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### PostgreSQL connection error
- Ensure PostgreSQL service is running
- Check DATABASE_URL in .env
- Verify credentials and database exist

### Missing microphone permission
- Check browser console for errors
- Some browsers require HTTPS for audio
- Test with https://example.com or localhost

### OpenAI API errors
- Verify API key is valid
- Check API quota/usage
- Review error message in terminal

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am "Description"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request on GitHub
5. Wait for CI checks to pass
6. Request review from team
7. Merge after approval

## Debugging Tips

### Frontend
- Use React DevTools browser extension
- Check network tab in browser dev tools
- Console logs for state changes

### Backend
- Use FastAPI docs at `/docs`
- Add print statements or use debugger
- Check logs in terminal
- Test endpoints with curl/Postman

### Database
```bash
# Connect to PostgreSQL
psql -U nia_user -d nia -h localhost

# Useful commands
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM users;  # Query data
```

## Performance Optimization

### Frontend
- Use React.memo for components
- Lazy load routes with React.lazy
- Optimize bundle size
- Use dev tools to profile

### Backend
- Add database indexes for frequently queried fields
- Cache conversation context
- Use connection pooling
- Monitor API response times

## Deployment

### Local Testing Before Deploy
```bash
# Backend
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Deployment
```bash
docker-compose up --build
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Create new issue with details
4. Contact team members

---

Happy coding! 🚀
