from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class TodoList(Base):
    __tablename__ = 'todo_lists'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(20), default='blue')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    todos = relationship("Todo", back_populates="todo_list", cascade="all, delete-orphan")

class Todo(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), nullable=False, index=True)
    list_id = Column(Integer, ForeignKey('todo_lists.id'), nullable=False)
    title = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    todo_list = relationship("TodoList", back_populates="todos")