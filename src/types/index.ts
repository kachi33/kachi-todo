export interface TodoList {
  id: number;
  name: string;
  color: string;
  todo_count: number;
}

export interface CreateTodoListData {
  name: string;
  color?: string;
}

export interface Todo {
  id: number;
  title: string;
  detail?: string;
  priority: string;
  due_date?: string;
  due_time?: string;
  end_time?: string;
  end_date?: string;
  completed: boolean;
  list_id?: number;
  list_name?: string;
  userId: string;
}

export interface CreateTodoData {
  title: string;
  list_id?: number;
  detail?: string;
  priority?: string;
  due_date?: string;
  due_time?: string;
  end_time?: string;
  end_date?: string;
  completed?: boolean;
}

export interface TodoListItemProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onDelete?: (todo: Todo) => void;
}

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CreateTodoProps {
  onCreate: (todo: Todo) => void;
}

export interface ProductivityStats {
  total_todos: number;
  completed_todos: number;
  pending_todos: number;
  completion_rate: number;
  todos_created_today: number;
  todos_completed_today: number;
  active_streak: number;
  total_productivity_score: number;
}