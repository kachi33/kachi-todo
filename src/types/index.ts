export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoData {
  title: string;
  completed?: boolean;
  userId?: number;
}

export interface TodoListItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CreateTodoProps {
  onCreate: (todo: Todo) => void;
}