import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, EllipsisVertical, Trash2, Move3d } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { TodoListItemProps } from "@/types";
import { formatDateTime } from "@/lib/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodoLists, updateTodo } from "@/lib/offlineApi";

function TodoListItem({
  todo,
  onEdit,
  onDelete,
}: TodoListItemProps): React.JSX.Element {
  const { openSidebar } = useSidebar();
  const [openMore, setOpenMore] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
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
      setShowMoveMenu(false);
      setOpenMore(false);
    },
    onError: (error) => {
      console.error("Failed to move todo:", error);
      alert("Failed to move todo. Please try again.");
    },
  });

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

  return (
    <li
      className={`p-3 ${getPriorityColor(
        todo.priority
      )} border border-l-4 border-border rounded flex bg-background/50 hover:bg-accent transition-colors`}
    >
      <div
        className="w-full flex flex-col space-y-2"
        onClick={() => openSidebar(todo)}
      >
        {/*list title, detail, date/time and list name */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-card-foreground">
              {todo.title}
            </span>
            {todo.detail && (
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {todo.detail}
              </span>
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
                <Badge variant="outline" className="text-xs">
                  {todo.list_name}
                </Badge>
              )}

            </div>

          </div>
        </div>

          </div>
        <div className="hidden md:flex cursor-pointer items-start">
          <EllipsisVertical
            className="h-4 w-4 text-muted-foreground"
            onClick={setOpenMore.bind(null, !openMore)}
          />
        </div>
      {openMore && (
        <div className="relative flex items">
          <div className="absolute top-0 right-0 bg-card border border-border rounded-md shadow-md w-32 z-10">
            <ul className="p-2 space-y-2">
                    <li
                      className="text-muted-foreground flex items-center justify-between text-sm cursor-pointer hover:text-foreground"
                      onClick={() => setShowMoveMenu(!showMoveMenu)}
                    >
                      Move to
                      <Move3d className="h-4 w-4 ml-1" />
                    </li>
                    {showMoveMenu && (
                      <ul className="ml-2 mt-1 space-y-1">
                        {lists
                          .filter(list => list.id !== todo.list_id)
                          .map(list => (
                            <li
                              key={list.id}
                              className="text-sm text-foreground cursor-pointer hover:bg-accent px-2 py-1 rounded"
                              onClick={() => {
                                moveTodoMutation.mutate({
                                  todoId: todo.id,
                                  listId: list.id,
                                });
                              }}
                            >
                              {list.name}
                            </li>
                          ))}
                        {lists.filter(list => list.id !== todo.list_id).length === 0 && (
                          <li className="text-xs text-muted-foreground px-2 py-1">
                            No other lists available
                          </li>
                        )}
                      </ul>
                    )}
                    <li
                      className=""
                      onClick={() => onEdit(todo)}
                    >
                      Edit 
                    </li>
                    <li
                    className="text-destructive text-sm flex items-center justify-between"
                    onClick={() => onDelete(todo)}
                    >
                      Delete
                    <Trash2 className="h-4 w-4  ml-1" />
                    </li>
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default TodoListItem;
