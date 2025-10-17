from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import engine
from models import Base
from routes import lists, todos, stats, session

app = FastAPI(title="Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle database migration
try:
    from migrate import migrate_database
    migrate_database()
except Exception as e:
    print(f"Migration warning: {e}")
    # Fallback to basic table creation
    Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(session.router)
app.include_router(lists.router)
app.include_router(todos.router)
app.include_router(stats.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))