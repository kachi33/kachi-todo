"use client";

import { useState, useMemo } from "react";
import TodoListItem from "@/components/TodoListItems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTodos, fetchTodoLists } from "@/lib/api";
import PaginationControl from "@/components/PaginationControl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteTodo from "@/components/DeleteTodo";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { Todo } from "@/types";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent} from "@/components/ui/empty";
import { ListTodo, Plus, Filter, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OfflineStatus from "@/components/OfflineStatus";
import CreateList from "@/components/CreateList";
import ListCard from "@/components/ListCard";
import DeleteList from "@/components/DeleteList";
import { TodoList } from "@/types";

function Tasks(): React.JSX.Element {
  const queryClient = useQueryClient();
  const { openCreateMode } = useSidebar();

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
    queryFn: fetchTodoLists,
  });

  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [listModalOpen, setListModalOpen] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  const [deleteList, setDeleteList] = useState<TodoList | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priority: [],
    status: "all",
    listId: null,
  });
  const todosPerPage = 4;

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

  const handleListClick = (list: TodoList): void => {
    // Toggle behavior: if clicked list is already active, clear filter
    if (filters.listId === list.id) {
      setFilters({ ...filters, listId: null });
    } else {
      setFilters({ ...filters, listId: list.id });
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearAllFilters = (): void => {
    setFilters({
      priority: [],
      status: "all",
      listId: null,
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.listId !== null || filters.priority.length > 0 || filters.status !== "all";
  }, [filters]);

  // Generate active filter text
  const activeFiltersText = useMemo(() => {
    const filterTexts: string[] = [];

    // List filter
    if (filters.listId !== null) {
      const activeList = todoLists.find((list) => list.id === filters.listId);
      if (activeList) {
        filterTexts.push(`List: ${activeList.name}`);
      }
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filterTexts.push(`Priority: ${filters.priority.join(", ")}`);
    }

    // Status filter
    if (filters.status !== "all") {
      filterTexts.push(`Status: ${filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}`);
    }

    return filterTexts.length > 0 ? filterTexts.join(" • ") : "None";
  }, [filters, todoLists]);

  // Apply filters to todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Priority filter
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(todo.priority)
      ) {
        return false;
      }

      // Status filter
      if (filters.status === "completed" && !todo.completed) {
        return false;
      }
      if (filters.status === "pending" && todo.completed) {
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

  return (
    <div className="w-full flex flex-col gap-3 lg:gap-4">
      {/* Horizontal Scrollable Lists Section */}
      <section className="w-full">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* New List Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={() => {
                setSelectedList(null);
                setListModalOpen(true);
              }}
              variant="outline"
              size="lg"
              className="w-[200px] h-[140px] border-dashed border-2 flex flex-col items-center justify-center gap-2 hover:bg-accent/50 rounded-xl"
            >
              <FolderPlus className="h-8 w-8" />
              <span className="text-sm font-medium">New List</span>
            </Button>
          </div>

          {/* List Cards */}
          {todoLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onEdit={(list) => {
                setSelectedList(list);
                setListModalOpen(true);
              }}
              onDelete={setDeleteList}
              onClick={handleListClick}
              isActive={filters.listId === list.id}
            />
          ))}
        </div>
      </section>

{/* Main Content */}
    <section  className="w-full flex flex-col gap-3 lg:gap-6">
  
      {/* Header */}
      <div className="flex items-center  justify-between">
        <h1 className="md:text-2xl text-xl font-bold text-foreground">
          All Tasks
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={openCreateMode}
            variant="default"
            size="default"
            className=""
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        </div>
      </div>

        <Separator className="" />
      <div className="text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
        {/* filter text */}
          {hasActiveFilters && (
        <>
          <p className="text-sm">
            {activeFiltersText}
          </p>
            <Button
              onClick={handleClearAllFilters}
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
            >
              Clear All 
            </Button>
            </>
          )}
          </div>

        <div className="flex justify-end items-center gap-3">
          <OfflineStatus />
          <FilterModal
            open={filterModalOpen}
            onOpenChange={setFilterModalOpen}
            onApplyFilters={handleApplyFilters}
            currentFilters={filters}
            availableLists={todoLists.map((list) => ({
              id: list.id,
              name: list.name,
            }))}
          >
            <Button variant="outline" size="default" className="">
              <Filter className="h-4 w-4" />
            </Button>
          </FilterModal>
        </div>
      </div>

      {todos.length > 0 ? (
        <>
          <ScrollArea className="h-[40vh] p-2">
            <ul className="space-y-2">
              {paginatedTodos.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </ScrollArea>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
          <EmptyHeader className="">
            <EmptyMedia variant="icon" className="">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle className="">No tasks found.</EmptyTitle>
            <EmptyDescription className="">
              {todos.length === 0
                ? "Create a new task to get started."
                : "No tasks found."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-2">
            <Button
              onClick={openCreateMode}
              variant="default"
              size="default"
              className=""
            >
              <Plus className="h-4 w-4" />
              Add New Task
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {deleteTodo && (
        <DeleteTodo
          todo={deleteTodo}
          onDelete={handleDelete}
          open={!!deleteTodo}
          onOpenChange={(open) => !open && setDeleteTodo(null)}
        />
      )}

      <CreateList
        list={selectedList}
        open={listModalOpen}
        onOpenChange={(open) => {
          setListModalOpen(open);
          if (!open) setSelectedList(null);
        }}
      />

      <DeleteList
        list={deleteList}
        open={!!deleteList}
        onOpenChange={(open) => !open && setDeleteList(null)}
      />
      </section>

    </div>
  );
}

export default Tasks;
