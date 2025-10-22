import { Todo, CreateTodoData, TodoList, CreateTodoListData } from '@/types';
import { offlineStorage } from './offlineStorage';
import { syncManager } from './syncManager';
import * as originalApi from './api';

const isOnline = () => navigator.onLine;

// Enhanced API functions that work offline
export const fetchTodos = async (listId?: number): Promise<Todo[]> => {
  if (isOnline()) {
    try {
      // Try to fetch from server and cache locally
      const serverTodos = await originalApi.fetchTodos(listId);
      await offlineStorage.saveTodos(serverTodos);
      return serverTodos;
    } catch (error) {
      console.warn('Failed to fetch from server, falling back to offline data:', error);
    }
  }

  // Return offline data
  const offlineTodos = await offlineStorage.getTodos();

  if (listId) {
    return offlineTodos.filter(todo => todo.list_id === listId);
  }

  return offlineTodos;
};

export const fetchTodoById = async (id: string | number): Promise<Todo> => {
  const numericId = typeof id === 'string' ? parseInt(id) : id;

  if (isOnline()) {
    try {
      const serverTodo = await originalApi.fetchTodoById(id);
      await offlineStorage.saveTodo(serverTodo);
      return serverTodo;
    } catch (error) {
      console.warn('Failed to fetch todo from server, falling back to offline data:', error);
    }
  }

  // Return offline data
  const offlineTodos = await offlineStorage.getTodos();
  const todo = offlineTodos.find(t => t.id === numericId);

  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }

  return todo;
};

export const createTodo = async (todo: CreateTodoData): Promise<Todo> => {
  if (isOnline()) {
    try {
      const serverTodo = await originalApi.createTodo(todo);
      await offlineStorage.saveTodo(serverTodo);
      return serverTodo;
    } catch (error) {
      console.warn('Failed to create todo on server, creating offline:', error);
    }
  }

  // Create offline
  return await syncManager.createTodoOffline(todo);
};

export const updateTodo = async (id: number, todo: Partial<CreateTodoData>): Promise<Todo> => {
  if (isOnline()) {
    try {
      const serverTodo = await originalApi.updateTodo(id, todo);
      await offlineStorage.saveTodo(serverTodo);
      return serverTodo;
    } catch (error) {
      console.warn('Failed to update todo on server, updating offline:', error);
    }
  }

  // Update offline
  await syncManager.updateTodoOffline(id, todo);

  // Return updated todo from offline storage
  const offlineTodos = await offlineStorage.getTodos();
  const updatedTodo = offlineTodos.find(t => t.id === id);

  if (!updatedTodo) {
    throw new Error(`Todo with id ${id} not found`);
  }

  return updatedTodo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  if (isOnline()) {
    try {
      await originalApi.deleteTodo(id);
      await offlineStorage.deleteTodo(id);
      return;
    } catch (error) {
      console.warn('Failed to delete todo on server, deleting offline:', error);
    }
  }

  // Delete offline
  await syncManager.deleteTodoOffline(id);
};

export const fetchUserStats = async () => {
  if (isOnline()) {
    try {
      return await originalApi.fetchUserStats();
    } catch (error) {
      console.warn('Failed to fetch stats from server, calculating offline:', error);
    }
  }

  // Calculate stats from offline data
  const todos = await offlineStorage.getTodos();
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // Simple offline stats (some features won't be available)
  return {
    total_todos: totalTodos,
    completed_todos: completedTodos,
    pending_todos: pendingTodos,
    completion_rate: completionRate,
    todos_created_today: 0, // Would need more complex tracking
    todos_completed_today: 0, // Would need more complex tracking
    active_streak: 0, // Would need more complex tracking
    total_productivity_score: Math.round(completionRate)
  };
};

// Todo Lists - simpler offline fallback
export const fetchTodoLists = async (): Promise<TodoList[]> => {
  if (isOnline()) {
    try {
      const serverLists = await originalApi.fetchTodoLists();
      await offlineStorage.saveTodoLists(serverLists);
      return serverLists;
    } catch (error) {
      console.warn('Failed to fetch lists from server, falling back to offline data:', error);
    }
  }

  return await offlineStorage.getTodoLists();
};

export const createTodoList = async (listData: CreateTodoListData): Promise<TodoList> => {
  if (isOnline()) {
    try {
      const serverList = await originalApi.createTodoList(listData);
      const currentLists = await offlineStorage.getTodoLists();
      await offlineStorage.saveTodoLists([...currentLists, serverList]);
      return serverList;
    } catch (error) {
      console.warn('Failed to create list on server:', error);
      throw error; // List creation is more critical, don't create offline version
    }
  }

  throw new Error('Cannot create todo lists while offline');
};

export const updateTodoList = async (id: number, listData: Partial<CreateTodoListData>): Promise<TodoList> => {
  if (isOnline()) {
    return await originalApi.updateTodoList(id, listData);
  }

  throw new Error('Cannot update todo lists while offline');
};

export const deleteTodoList = async (id: number): Promise<void> => {
  if (isOnline()) {
    return await originalApi.deleteTodoList(id);
  }

  throw new Error('Cannot delete todo lists while offline');
};