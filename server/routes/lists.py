from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db, ensure_default_list
from dependencies import get_session_id
from models import TodoList
from schemas import TodoListCreate, TodoListUpdate, TodoListResponse

router = APIRouter(prefix="/api/lists", tags=["Todo Lists"])

@router.get("", response_model=List[TodoListResponse])
def get_todo_lists(
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    ensure_default_list(session_id, db)
    lists = db.query(TodoList).filter(TodoList.session_id == session_id).all()

    return [
        TodoListResponse(
            id=lst.id,
            name=lst.name,
            color=lst.color,
            todo_count=len(lst.todos)
        )
        for lst in lists
    ]

@router.post("", response_model=TodoListResponse, status_code=201)
def create_todo_list(
    list_data: TodoListCreate,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo_list = TodoList(
        session_id=session_id,
        name=list_data.name,
        color=list_data.color
    )
    db.add(todo_list)
    db.commit()
    db.refresh(todo_list)

    return TodoListResponse(
        id=todo_list.id,
        name=todo_list.name,
        color=todo_list.color,
        todo_count=0
    )

@router.put("/{list_id}", response_model=TodoListResponse)
def update_todo_list(
    list_id: int,
    list_data: TodoListUpdate,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo_list = db.query(TodoList).filter(
        TodoList.id == list_id,
        TodoList.session_id == session_id
    ).first()

    if not todo_list:
        raise HTTPException(status_code=404, detail="Todo list not found")

    if list_data.name is not None:
        todo_list.name = list_data.name
    if list_data.color is not None:
        todo_list.color = list_data.color

    todo_list.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(todo_list)

    return TodoListResponse(
        id=todo_list.id,
        name=todo_list.name,
        color=todo_list.color,
        todo_count=len(todo_list.todos)
    )

@router.delete("/{list_id}")
def delete_todo_list(
    list_id: int,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo_list = db.query(TodoList).filter(
        TodoList.id == list_id,
        TodoList.session_id == session_id
    ).first()

    if not todo_list:
        raise HTTPException(status_code=404, detail="Todo list not found")

    # Don't allow deleting the last list
    total_lists = db.query(TodoList).filter(TodoList.session_id == session_id).count()
    if total_lists <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the last todo list")

    db.delete(todo_list)
    db.commit()

    return {"message": "Todo list deleted successfully"}