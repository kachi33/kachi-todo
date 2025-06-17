import { useState } from "react";
import TodoListItem from "@/components/TodoListItems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTodos } from "@/lib/api";
import PaginationControl from "@/components/PaginationControl";
import { useQuery } from "@tanstack/react-query";

function TodoList() {
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedTodos = todos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );
  const totalPages = Math.ceil(todos.length / todosPerPage);

  const openEditModal = () => {
    console.log("Edit this todo");
  };

  const openDeleteModal = () => {
    console.log("Delete this todo");
  };

  if (isLoading) return <div className="p-4">Loading todos...</div>;

  if (isError)
    return <div className="p-4 text-red-500">Error loading todos</div>;

  return (
    <main className="md:p-4 max-h-[100vh] bg-stone-200">
      <h1 className="md:text-2xl text- xl font-bold">Kachi's Todo List</h1>
      <ScrollArea className="h-[80vh] rounded-md p-4 ">
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
      </ScrollArea>
      <div className="mt-6 flex justify-center">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}

export default TodoList;
