from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db, ensure_default_list
from dependencies import get_session_id
from models import Todo, TodoList
from schemas import TodoCreate, TodoUpdate, TodoResponse

router = APIRouter(prefix="/api/todos", tags=["Todos"])

@router.get("", response_model=List[TodoResponse])
def get_todos(
    list_id: Optional[int] = None,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    ensure_default_list(session_id, db)

    query = db.query(Todo).join(TodoList).filter(Todo.session_id == session_id)

    if list_id:
        query = query.filter(Todo.list_id == list_id)

    todos = query.all()

    return [
        TodoResponse(
            id=todo.id,
            title=todo.title,
            completed=todo.completed,
            list_id=todo.list_id,
            list_name=todo.todo_list.name,
            userId=session_id
        )
        for todo in todos
    ]

@router.post("", response_model=TodoResponse, status_code=201)
def create_todo(
    todo_data: TodoCreate,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    # Verify the list exists and belongs to the user
    todo_list = db.query(TodoList).filter(
        TodoList.id == todo_data.list_id,
        TodoList.session_id == session_id
    ).first()

    if not todo_list:
        raise HTTPException(status_code=404, detail="Todo list not found")

    todo = Todo(
        session_id=session_id,
        list_id=todo_data.list_id,
        title=todo_data.title,
        completed=todo_data.completed
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)

    return TodoResponse(
        id=todo.id,
        title=todo.title,
        completed=todo.completed,
        list_id=todo.list_id,
        list_name=todo_list.name,
        userId=session_id
    )

@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).join(TodoList).filter(
        Todo.id == todo_id,
        Todo.session_id == session_id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return TodoResponse(
        id=todo.id,
        title=todo.title,
        completed=todo.completed,
        list_id=todo.list_id,
        list_name=todo.todo_list.name,
        userId=session_id
    )

@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).join(TodoList).filter(
        Todo.id == todo_id,
        Todo.session_id == session_id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.completed is not None:
        todo.completed = todo_data.completed
    if todo_data.list_id is not None:
        # Verify the new list exists and belongs to the user
        new_list = db.query(TodoList).filter(
            TodoList.id == todo_data.list_id,
            TodoList.session_id == session_id
        ).first()
        if not new_list:
            raise HTTPException(status_code=404, detail="Target todo list not found")
        todo.list_id = todo_data.list_id

    todo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(todo)

    return TodoResponse(
        id=todo.id,
        title=todo.title,
        completed=todo.completed,
        list_id=todo.list_id,
        list_name=todo.todo_list.name,
        userId=session_id
    )

@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.session_id == session_id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted successfully"}