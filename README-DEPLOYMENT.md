# Todo App Deployment Guide

This todo app supports user-specific todo management without registration using session-based identification.

## Features
- **No Registration Required**: Users get a unique session ID automatically
- **User-Specific Data**: Each user only sees their own todos
- **Full CRUD Operations**: Create, read, update, delete todos
- **Persistent Storage**: SQLite database with session-based user isolation

## Local Development

### Backend (Python Flask)
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend will run on `http://localhost:5000`

### Frontend (React + TypeScript)
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and run both frontend and backend
docker-compose up --build

# Run in background
docker-compose up -d --build
```

Access the app at `http://localhost:3000`

### Individual Docker Builds

#### Backend Only
```bash
cd server
docker build -t todo-backend .
docker run -p 5000:5000 todo-backend
```

#### Frontend Only
```bash
cd client
docker build -t todo-frontend .
docker run -p 3000:3000 todo-frontend
```

## Production Deployment

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=sqlite:///todos.db  # or postgres://... for production
```

#### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Recommended Production Setup

1. **Backend**: Deploy to services like Railway, Render, or Heroku
2. **Frontend**: Deploy to Netlify, Vercel, or Cloudflare Pages
3. **Database**: Use PostgreSQL for production (update DATABASE_URL)

### Railway Deployment (Example)

1. **Backend**:
   - Connect GitHub repo
   - Set root directory to `server`
   - Add environment variable: `DATABASE_URL=postgresql://...`

2. **Frontend**:
   - Connect GitHub repo
   - Set root directory to `client`
   - Add environment variable: `VITE_API_BASE_URL=https://your-backend.railway.app`

## API Endpoints

- `POST /api/session` - Create new user session
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

All endpoints require `X-Session-ID` header except session creation.

## How It Works

1. User visits the app
2. Frontend automatically creates a session ID if none exists
3. Session ID is stored in localStorage
4. All API requests include the session ID in headers
5. Backend filters all data by session ID
6. Each user only sees/manages their own todos

No registration, no passwords, just simple session-based isolation!