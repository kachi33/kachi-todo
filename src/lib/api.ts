import { Todo, CreateTodoData, TodoList, CreateTodoListData } from '@/types';
import { ensureSession } from './session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const createAuthHeaders = async () => {
  const sessionId = await ensureSession();
  return {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId,
  };
};

// === Todos Methods ===
export const fetchTodos = async (listId?: number): Promise<Todo[]> => {
  const headers = await createAuthHeaders();
  const url = listId ? `${BASE_URL}/api/todos?list_id=${listId}` : `${BASE_URL}/api/todos`;
  const res = await fetch(url, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export const fetchTodoById = async (id: string | number): Promise<Todo> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch todo');
  return res.json();
}

export const createTodo = async (todo: CreateTodoData): Promise<Todo> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/todos`, {
    method: 'POST',
    headers,
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export const updateTodo = async (id: number, todo: Partial<CreateTodoData>): Promise<Todo> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

export const deleteTodo = async (id: number): Promise<void> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete todo');
};

export const fetchUserStats = async () => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/stats`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};

// === TodoList Methods ===
export const fetchTodoLists = async (): Promise<TodoList[]> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/lists`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch todo lists');
  return res.json();
};

export const createTodoList = async (listData: CreateTodoListData): Promise<TodoList> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/lists`, {
    method: 'POST',
    headers,
    body: JSON.stringify(listData),
  });
  if (!res.ok) throw new Error('Failed to create todo list');
  return res.json();
};

export const updateTodoList = async (id: number, listData: Partial<CreateTodoListData>): Promise<TodoList> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/lists/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(listData),
  });
  if (!res.ok) throw new Error('Failed to update todo list');
  return res.json();
};

export const deleteTodoList = async (id: number): Promise<void> => {
  const headers = await createAuthHeaders();
  const res = await fetch(`${BASE_URL}/api/lists/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete todo list');
};
