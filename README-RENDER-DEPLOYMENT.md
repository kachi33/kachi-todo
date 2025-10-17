# Deploy Todo App to Render

## FastAPI Backend Deployment on Render

### Step 1: Push to GitHub
1. Create a new GitHub repository
2. Push your code:
```bash
git add .
git commit -m "FastAPI todo app for Render deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: `todo-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or your preferred plan)

### Step 3: Environment Variables
Add these in Render dashboard:
- `DATABASE_URL`: `sqlite:///todos.db` (or PostgreSQL URL for production)

### Step 4: Get Your API URL
After deployment, you'll get a URL like:
`https://your-service-name.onrender.com`

## React Frontend Deployment

### Option 1: Netlify
1. Build the frontend:
```bash
cd client
npm run build
```
2. Deploy `dist` folder to Netlify
3. Add environment variable:
   - `VITE_API_BASE_URL`: `https://your-render-api.onrender.com`

### Option 2: Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Add environment variable:
   - `VITE_API_BASE_URL`: `https://your-render-api.onrender.com`

## Complete Setup Commands

### Backend Local Testing
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Local Testing
```bash
cd client
npm install
npm run dev
```

## Production Considerations

### Database
For production, consider using PostgreSQL:
1. Add PostgreSQL add-on in Render
2. Update `DATABASE_URL` environment variable

### CORS
The FastAPI app is configured with permissive CORS for development. For production, update the `allow_origins` in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## API Documentation
Once deployed, visit `https://your-render-api.onrender.com/docs` to see the interactive FastAPI documentation.

## Features
- ✅ Session-based user identification (no registration)
- ✅ Full CRUD operations for todos
- ✅ User-specific data isolation
- ✅ FastAPI with automatic OpenAPI docs
- ✅ Ready for Render deployment
- ✅ React TypeScript frontend