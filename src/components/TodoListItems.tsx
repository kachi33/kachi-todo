import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, EllipsisVertical, Trash2, Edit2, Copy } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { TodoListItemProps } from "@/types";
import { formatDateTime } from "@/lib/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodoLists, updateTodo, deleteTodo, createTodo } from "@/lib/offlineApi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyncBadge, SyncBadgeStatus } from "@/components/SyncBadge";

function TodoListItem({
  todo,
  onEdit,
  onDelete,
}: TodoListItemProps): React.JSX.Element {
  const { openSidebar } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available lists
  const { data: lists = [] } = useQuery({
    queryKey: ["todoLists"],
    queryFn: fetchTodoLists,
  });

  // Mutation to move todo to a different list
  const moveTodoMutation = useMutation({
    mutationFn: ({ todoId, listId }: { todoId: number; listId: number }) =>
      updateTodo(todoId, { list_id: listId }),
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setDropdownOpen(false);
    },
    onError: (error) => {
      console.error("Failed to move todo:", error);
      alert("Failed to move todo. Please try again.");
    },
  });

  // Mutation to delete todo
  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: number) => deleteTodo(todoId),
    onSuccess: () => {
      toast.success("Task moved to trash");
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      setDropdownOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to delete task");
      console.error("Failed to delete todo:", error);
    },
  });

  // Mutation to duplicate todo
  const duplicateTodoMutation = useMutation({
    mutationFn: () =>
      createTodo({
        title: `${todo.title} (Copy)`,
        detail: todo.detail,
        priority: todo.priority,
        due_date: todo.due_date,
        due_time: todo.due_time,
        list_id: todo.list_id,
        completed: false,
      }),
    onSuccess: () => {
      toast.success("Task duplicated successfully");
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      setDropdownOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to duplicate task");
      console.error("Failed to duplicate todo:", error);
    },
  });

  // Mutation to toggle completion status
  const toggleCompletionMutation = useMutation({
    mutationFn: () => updateTodo(todo.id, { completed: !todo.completed }),
    onSuccess: () => {
      toast.success(
        todo.completed
          ? "Task marked as pending"
          : "Task marked as completed"
      );
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      setDropdownOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update task");
      console.error("Failed to toggle completion:", error);
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to move this task to trash?")) {
      deleteTodoMutation.mutate(todo.id);
    }
  };

  const handleDuplicate = () => {
    duplicateTodoMutation.mutate();
  };

  const handleToggleCompletion = () => {
    toggleCompletionMutation.mutate();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-grey-500";
    }
  };

  // Get the list color for the current todo
  const getListColor = () => {
    if (!todo.list_id) return null;
    const list = lists.find((l) => l.id === todo.list_id);
    return list?.color || null;
  };

  // Determine sync status for this todo
  const getSyncStatus = (): SyncBadgeStatus | null => {
    // If todo has negative ID, it's a pending offline creation
    if (todo.id < 0) {
      return 'pending';
    }

    // Check if currently being modified (mutations in progress)
    if (deleteTodoMutation.isPending || duplicateTodoMutation.isPending || moveTodoMutation.isPending) {
      return 'syncing';
    }

    // If mutations failed
    if (deleteTodoMutation.isError || duplicateTodoMutation.isError || moveTodoMutation.isError) {
      return 'failed';
    }

    // Otherwise, consider it synced (we'll enhance this in Phase 2 with sync queue checking)
    return null;
  };

  const syncStatus = getSyncStatus();

  return (
    <li
      className={`p-3 ${getPriorityColor(
        todo.priority
      )} border border-l-4 md:border-l-6 border-border rounded flex bg-card shadow-md hover:bg-accent transition-colors`}
    >
      <div
        className="w-full flex flex-col space-y-2"
        onClick={() => openSidebar(todo)}
      >
        {/*list title, detail, date/time and list name */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className={`capitalize font-medium text-card-foreground ${todo.completed ? 'line-through opacity-60' : ''}`}>
                {todo.title}
              </p>
              {syncStatus && (
                <SyncBadge status={syncStatus} className="shrink-0" />
              )}
            </div>
            {todo.detail && (
              <p className={`text-xs text-muted-foreground mt-1 line-clamp-2 ${todo.completed ? 'line-through opacity-60' : ''}`}>
                {todo.detail}
              </p>
            )}
            {/* Due date and time */}
            <div className="flex items-center gap-3">
              {(todo.due_date || todo.due_time) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>{formatDateTime(todo.due_date, todo.due_time)}</span>
                  </div>
                </div>
              )}
              {todo.list_name && (
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={getListColor() ? {
                    backgroundColor: getListColor()!,
                    borderColor: getListColor()!,
                    color: 'white'
                  } : undefined}
                >
                  {todo.list_name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="hidden md:flex cursor-pointer items-start">
            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Move to List Section */}
          {lists.filter((list) => list.id !== todo.list_id).length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Move to list
              </div>
              <ul className="py-1">
                {lists
                  .filter((list) => list.id !== todo.list_id)
                  .map((list) => (
                    <li key={list.id}>
                      <button
                        onClick={() => {
                          moveTodoMutation.mutate({
                            todoId: todo.id,
                            listId: list.id,
                          });
                        }}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer"
                      >
                        {list.name}
                      </button>
                    </li>
                  ))}
              </ul>
              <div className="bg-border -mx-1 my-1 h-px" />
            </>
          )}

          {/* Duplicate Task */}
          <button
            onClick={handleDuplicate}
            disabled={duplicateTodoMutation.isPending}
            className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            <span>{duplicateTodoMutation.isPending ? "Duplicating..." : "Duplicate Task"}</span>
          </button>

          {/* Mark as completed/pending */}
          <button
            onClick={handleToggleCompletion}
            disabled={toggleCompletionMutation.isPending}
            className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <Calendar className="h-4 w-4" />
            <span>
              {toggleCompletionMutation.isPending
                ? "Updating..."
                : todo.completed
                ? "Mark as Pending"
                : "Mark as Completed"}
            </span>
          </button>

          {/* Edit */}
          <button
            onClick={() => openSidebar(todo)}
            className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>

          <div className="bg-border -mx-1 my-1 h-px" />

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Move to trash</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

export default TodoListItem;
