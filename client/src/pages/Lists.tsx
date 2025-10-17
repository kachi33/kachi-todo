import { useState } from "react";
import TodoListItem from "@/components/TodoListItems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTodos } from "@/lib/api";
import PaginationControl from "@/components/PaginationControl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateTodo from "@/components/CreateTodo";
import EditTodo from "@/components/EditTodo";
import DeleteTodo from "@/components/DeleteTodo";
import { ThemeToggle } from "@/components/ThemeToggle";
import TodoListManager from "@/components/TodoListManager";
import { Todo } from "@/types";

function Lists(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", selectedListId],
    queryFn: () => fetchTodos(selectedListId || undefined),
    enabled: !!selectedListId,
  });

  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const paginatedTodos = todos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );
  const totalPages = Math.ceil(todos.length / todosPerPage);

  const openEditModal = (todo: Todo): void => {
    setEditTodo(todo);
  };

  const openDeleteModal = (todo: Todo): void => {
    setDeleteTodo(todo);
  };

  if (isLoading) return <div className="p-4 text-foreground bg-background">Loading todos...</div>;

  if (isError)
    return <div className="p-4 text-destructive bg-background">Error loading todos</div>;

  return (
    <main className="md:p-4 max-h-[100vh] bg-background transition-colors">
      <div className="flex justify-between items-center p-4">
        <h1 className="md:text-2xl text-xl font-bold text-foreground">Manage Your Lists</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {selectedListId && (
            <CreateTodo onCreate={handleCreate} selectedListId={selectedListId} />
          )}
        </div>
      </div>

      <div className="flex gap-6 p-4">
        {/* Left Sidebar - List Management */}
        <div className="w-1/3 min-w-[300px]">
          <TodoListManager
            selectedListId={selectedListId}
            onSelectList={setSelectedListId}
          />
        </div>

        {/* Main Content - Todos from Selected List */}
        <div className="flex-1">
          {selectedListId ? (
            <div>
              <div className="mb-4 p-4 bg-card border border-border rounded-lg">
                <h2 className="text-lg font-semibold text-card-foreground">
                  {todos.length > 0 ? todos[0].list_name : 'Selected List'}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({todos.length} task{todos.length !== 1 ? 's' : ''})
                  </span>
                </h2>
              </div>

              <ScrollArea className="h-[60vh] rounded-md">
                {todos.length > 0 ? (
                  <ul className="space-y-2">
                    {paginatedTodos.map((todo) => (
                      <TodoListItem
                        key={todo.id}
                        todo={todo}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    No tasks in this list yet. Click "Add New" to create your first task!
                  </div>
                )}
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
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-foreground mb-2">Select a List to Get Started</h3>
                <p>Choose a list from the sidebar to view and manage your tasks.</p>
                <p className="mt-2">You can also create new lists to organize your todos better!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editTodo && (
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
      )}
    </main>
  );
}

export default Lists;