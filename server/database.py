import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base, TodoList

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///todos.db')
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_default_list(session_id: str, db: Session):
    """Ensure user has at least a default list"""
    existing_lists = db.query(TodoList).filter(TodoList.session_id == session_id).count()
    if existing_lists == 0:
        default_list = TodoList(
            session_id=session_id,
            name="Personal",
            color="blue"
        )
        db.add(default_list)
        db.commit()
        return default_list
    return None