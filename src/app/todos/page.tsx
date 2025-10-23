'use client';

import { useState, useMemo } from "react";
import TodoListItem from "@/components/TodoListItems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTodos, fetchTodoLists } from "@/lib/api";
import PaginationControl from "@/components/PaginationControl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateTodoWithListSelector from "@/components/CreateTodoWithListSelector";
import EditTodo from "@/components/EditTodo";
import DeleteTodo from "@/components/DeleteTodo";
import ThemeToggle from "@/components/ThemeToggle";
import { Todo } from "@/types";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DivideCircle, Filter, X } from "lucide-react";

function TodoList(): React.JSX.Element {
  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(), // No list filter - get ALL todos
  });

  const { data: todoLists = [] } = useQuery({
    queryKey: ["todoLists"],
    queryFn: () => fetchTodoLists(),
  });

  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priority: [],
    status: "all",
    listId: null,
  });
  const todosPerPage = 10;

  const handleCreate = (newTodo: Todo): void => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    queryClient.invalidateQueries({ queryKey: ["todoLists"] });
  };

  const handleUpdate = (updatedTodo: Todo): void => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  const handleDelete = (todoId: number): void => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    queryClient.invalidateQueries({ queryKey: ["todoLists"] });
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions): void => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRemoveFilter = (filterType: 'priority' | 'status' | 'list', value?: string): void => {
    if (filterType === 'priority' && value) {
      setFilters(prev => ({
        ...prev,
        priority: prev.priority.filter(p => p !== value)
      }));
    } else if (filterType === 'status') {
      setFilters(prev => ({
        ...prev,
        status: 'all'
      }));
    } else if (filterType === 'list') {
      setFilters(prev => ({
        ...prev,
        listId: null
      }));
    }
  };

  const handleClearAllFilters = (): void => {
    setFilters({
      priority: [],
      status: "all",
      listId: null,
    });
  };

  // Apply filters to todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(todo.priority)) {
        return false;
      }

      // Status filter
      if (filters.status === 'completed' && !todo.completed) {
        return false;
      }
      if (filters.status === 'pending' && todo.completed) {
        return false;
      }

      // List filter
      if (filters.listId !== null && todo.list_id !== filters.listId) {
        return false;
      }

      return true;
    });
  }, [todos, filters]);

  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const activeFiltersCount =
    filters.priority.length +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.listId !== null ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  const openEditModal = (todo: Todo): void => {
    setEditTodo(todo);
  };

  const openDeleteModal = (todo: Todo): void => {
    setDeleteTodo(todo);
  };

  if (isLoading)
    return (
      <div className="p-4 text-foreground bg-background">Loading todos...</div>
    );

  if (isError)
    return (
      <div className="p-4 text-destructive bg-background">
        Error loading todos
      </div>
    );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <>
      <div className="p-4 w-full">
        {todos.length > 0 ? (
          <>
            {/* Enhanced Header Section */}
            <div className="mb-6 py-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground mb-1">
                    Your Tasks
                  </h1>
                </div>
<div className="flex items-center justify-between gap-3">
                <FilterModal
                  open={isFilterModalOpen}
                  onOpenChange={setIsFilterModalOpen}
                  onApplyFilters={handleApplyFilters}
                  currentFilters={filters}
                  availableLists={todoLists}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {/* Filters */}
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </FilterModal>
                  <CreateTodoWithListSelector onCreate={handleCreate} />
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Active filters:</span>

                  {filters.priority.map((priority) => (
                    <Badge
                      key={priority}
                      className={`${getPriorityColor(priority)} cursor-pointer`}
                      onClick={() => handleRemoveFilter('priority', priority)}
                    >
                      {getPriorityEmoji(priority)} {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}

                  {filters.status !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveFilter('status')}
                    >
                      {filters.status === 'completed' ? 'Completed' : 'Pending'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}

                  {filters.listId !== null && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveFilter('list')}
                    >
                      {todoLists.find(l => l.id === filters.listId)?.name || 'List'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllFilters}
                    className="h-6 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}

            </div>

            <ScrollArea className="h-[60vh] rounded-md">
              <ul className="space-y-3">
                {paginatedTodos.map((todo) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    // onEdit={openEditModal}
                    // onDelete={openDeleteModal}
                  />
                ))}
              </ul>
            </ScrollArea>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No tasks yet
              </h3>
              <p>Create your first task to get started!</p>
            </div>
          </div>
        )}
      </div>

      {/* {editTodo && (
        <EditTodo
          todo={editTodo}
          onUpdate={handleUpdate}
          open={!!editTodo}
          onOpenChange={(open) => !open && setEditTodo(null)}
        />
      )}

      {deleteTodo && (
        <DeleteTodo
          todo={deleteTodo}
          onDelete={handleDelete}
          open={!!deleteTodo}
          onOpenChange={(open) => !open && setDeleteTodo(null)}
        />
      )} */}
    </>
  );
}

export default TodoList;
