from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import get_db
from dependencies import get_session_id
from models import Todo
from schemas import ProductivityStats

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("", response_model=ProductivityStats)
def get_user_stats(
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    # Get all todos for the user
    todos = db.query(Todo).filter(Todo.session_id == session_id).all()

    total_todos = len(todos)
    completed_todos = len([t for t in todos if t.completed])
    pending_todos = total_todos - completed_todos
    completion_rate = (completed_todos / total_todos * 100) if total_todos > 0 else 0

    # Get today's stats
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())

    todos_created_today = db.query(Todo).filter(
        Todo.session_id == session_id,
        Todo.created_at >= today_start,
        Todo.created_at <= today_end
    ).count()

    todos_completed_today = db.query(Todo).filter(
        Todo.session_id == session_id,
        Todo.completed == True,
        Todo.updated_at >= today_start,
        Todo.updated_at <= today_end
    ).count()

    # Calculate active streak (days with at least one completed todo)
    active_streak = 0
    current_date = today
    for i in range(30):  # Check last 30 days
        day_start = datetime.combine(current_date, datetime.min.time())
        day_end = datetime.combine(current_date, datetime.max.time())

        day_completed = db.query(Todo).filter(
            Todo.session_id == session_id,
            Todo.completed == True,
            Todo.updated_at >= day_start,
            Todo.updated_at <= day_end
        ).count()

        if day_completed > 0:
            active_streak += 1
            current_date -= timedelta(days=1)
        else:
            break

    # Calculate productivity score (simple algorithm)
    productivity_score = int(
        (completion_rate * 0.4) +
        (min(todos_completed_today * 10, 50)) +
        (min(active_streak * 5, 30)) +
        (min(total_todos * 2, 20))
    )

    return ProductivityStats(
        total_todos=total_todos,
        completed_todos=completed_todos,
        pending_todos=pending_todos,
        completion_rate=round(completion_rate, 1),
        todos_created_today=todos_created_today,
        todos_completed_today=todos_completed_today,
        active_streak=active_streak,
        total_productivity_score=productivity_score
    )