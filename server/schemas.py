from pydantic import BaseModel
from typing import Optional

class TodoListCreate(BaseModel):
    name: str
    color: Optional[str] = 'blue'

class TodoListUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

class TodoListResponse(BaseModel):
    id: int
    name: str
    color: str
    todo_count: int

class TodoCreate(BaseModel):
    title: str
    list_id: int
    completed: Optional[bool] = False

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    list_id: Optional[int] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    list_id: int
    list_name: str
    userId: str

class SessionResponse(BaseModel):
    session_id: str

class ProductivityStats(BaseModel):
    total_todos: int
    completed_todos: int
    pending_todos: int
    completion_rate: float
    todos_created_today: int
    todos_completed_today: int
    active_streak: int
    total_productivity_score: int