# Local Development Setup (No Docker)

This guide walks you through setting up Nia locally without using Docker.

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher (with npm)
- **PostgreSQL**: 12 or higher
- **Git**: For version control

## Step 1: Install Prerequisites

### Install Python
- **Ubuntu/Debian**: `sudo apt-get install python3 python3-venv python3-pip`
- **macOS**: `brew install python@3.11` or download from python.org
- **Windows**: Download from python.org and run installer

Verify: `python --version`

### Install Node.js
- Visit https://nodejs.org/ and download LTS version
- Or use package manager:
  - **Ubuntu**: `sudo apt-get install nodejs npm`
  - **macOS**: `brew install node`

Verify: `node --version && npm --version`

### Install PostgreSQL

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Windows:
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer (note the password you set for postgres user)
3. PostgreSQL runs automatically

Verify: `psql --version`

## Step 2: Clone Repository

```bash
git clone <repository-url>
cd nia
```

## Step 3: Database Setup

### Connect to PostgreSQL

```bash
# Linux/macOS
psql -U postgres

# Windows (in PowerShell)
psql -U postgres
```

### Create Database and User

Inside psql prompt, run:

```sql
-- Create user
CREATE USER nia_user WITH PASSWORD 'nia_password';

-- Create database
CREATE DATABASE nia OWNER nia_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nia TO nia_user;

-- Verify (should show nia database)
\l

-- Exit psql
\q
```

### Verify Connection

```bash
psql -U nia_user -d nia -h localhost
# If successful, you'll see: nia=>
# Exit with: \q
```

## Step 4: Backend Setup

### 1. Navigate to backend:
```bash
cd backend
```

### 2. Create virtual environment:
```bash
# Ubuntu/macOS/Windows (all same)
python -m venv venv

# Activate it:
# Ubuntu/macOS:
source venv/bin/activate

# Windows (Command Prompt):
venv\Scripts\activate

# Windows (PowerShell):
venv\Scripts\Activate.ps1
```

You should see `(venv)` prefix in your terminal.

### 3. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- fastapi - Web framework
- uvicorn - Server
- sqlalchemy - Database ORM
- openai - AI integration
- psycopg2 - PostgreSQL driver

### 4. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` file with a text editor and update:
```env
# Database connection
DATABASE_URL=postgresql://nia_user:nia_password@localhost:5432/nia

# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here

# Development settings (change for production)
JWT_SECRET=your-secret-key-change-in-production
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

### 5. Initialize database:
```bash
python -c "from app.db import init_db; init_db()"
```

You should see no errors. Check database:
```bash
psql -U nia_user -d nia
\dt  # Lists tables
\q   # Exit
```

### 6. Start backend server:
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend is running! Leave this terminal open.

### 7. Test backend (in new terminal):
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","version":"0.1.0"}
```

Visit http://localhost:8000/docs for API documentation.

## Step 5: Frontend Setup

### 1. Open new terminal, navigate to frontend:
```bash
cd frontend
```

### 2. Install dependencies:
```bash
npm install
```

This downloads ~400MB of packages (takes 2-5 minutes).

### 3. Start development server:
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

✅ Frontend is running!

## Step 6: Use the Application

1. Open browser: http://localhost:3000
2. Register a new account (any email/password)
3. Try text chat or voice input
4. Check backend logs in the first terminal

## Troubleshooting

### PostgreSQL Issues

**Error: "psql: error: FATAL: Ident authentication failed"**
- Edit `/etc/postgresql/*/main/pg_hba.conf` (Linux)
- Change `ident` to `md5` on the user line
- Restart: `sudo service postgresql restart`

**Error: "Connection refused"**
- Check PostgreSQL is running: `sudo service postgresql status`
- Start it: `sudo service postgresql start`

**Error: "Database already exists"**
- Drop it: `psql -U postgres -c "DROP DATABASE nia;"`
- Then retry creation

### Python Issues

**Error: "command not found: python"**
- Try `python3` instead of `python`
- Or: `which python3` and create alias

**Error: "No module named 'fastapi'"**
- Make sure venv is activated (should see `(venv)` prefix)
- Reinstall: `pip install -r requirements.txt`

**Error: "OPENAI_API_KEY" not found**
- Generate key at https://platform.openai.com/api-keys
- Add to backend/.env file
- Restart backend server

### Node.js Issues

**Error: "npm: command not found"**
- Reinstall Node.js from nodejs.org
- Restart terminal after installation

**Error: "port 3000 already in use"**
- Kill process:
  - Linux/macOS: `lsof -ti:3000 | xargs kill -9`
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

### Microphone Issues

**Error: "Permission denied" for microphone**
- Check browser console for details
- Browser may need permission - check notification bar
- Restart browser
- Use HTTPS in production (browsers restrict audio on HTTP in some cases)

### Connection Issues

**Error: "Cannot GET /docs"**
- Backend may not be running
- Check first terminal shows "Uvicorn running"
- Restart backend: `python main.py`

**Error: "Cannot reach backend from frontend"**
- Verify both are running on correct ports
- Check backend/.env has correct DATABASE_URL
- In frontend, API calls go to http://localhost:8000/api

## Useful Commands

### Backend
```bash
cd backend
source venv/bin/activate      # Activate venv (Linux/macOS)
deactivate                    # Deactivate venv
python main.py                # Run server
python -m pytest              # Run tests (after: pip install pytest)
```

### Frontend
```bash
cd frontend
npm install                   # Install dependencies
npm run dev                   # Development server
npm run build                 # Production build
npm run preview               # Preview production build
npm run type-check            # TypeScript checking
npm run lint                  # Linting
```

### Database
```bash
psql -U nia_user -d nia       # Connect to database
\dt                           # List tables
SELECT * FROM users;          # View users
SELECT * FROM conversation_history LIMIT 5;  # View chat history
\q                            # Exit psql
```

## Development Workflow

### Each Day / Session:

1. **Start PostgreSQL** (if not running):
   ```bash
   # Linux
   sudo service postgresql start
   
   # macOS
   brew services start postgresql
   ```

2. **Terminal 1 - Backend**:
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   python main.py
   ```

3. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Terminal 3 - Optional (debugging)**:
   ```bash
   psql -U nia_user -d nia
   # Run SQL queries to inspect data
   ```

5. Open http://localhost:3000 in browser

### When Done:
- Close terminals with Ctrl+C
- PostgreSQL keeps running (or stop with `sudo service postgresql stop`)

## File Changes During Development

Both backend and frontend watch for file changes:
- **Backend**: Automatically restarts when you edit Python files
- **Frontend**: Hot-reloads when you edit React/TypeScript files

Just save files and refresh browser!

## Next Steps

1. ✅ Application is running locally
2. 📖 Read [DEVELOPMENT.md](./DEVELOPMENT.md) for development guide
3. 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure
4. 🚀 Start building features!

## Getting Help

If something doesn't work:

1. **Check terminal output** - usually has helpful error messages
2. **Check browser console** - F12 or Ctrl+Shift+I
3. **Check backend logs** - where `python main.py` is running
4. **Verify prerequisites** - run all `--version` commands above
5. **Restart everything** - sometimes helps with connection issues
6. **Search [DEVELOPMENT.md](./DEVELOPMENT.md)** - has more tips

---

You're all set! 🎉
