import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, EllipsisVertical, Trash2, Edit2 } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { TodoListItemProps } from "@/types";
import { formatDateTime } from "@/lib/dateUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodoLists, updateTodo } from "@/lib/offlineApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function TodoListItem({
  todo,
  onEdit,
  onDelete,
}: TodoListItemProps): React.JSX.Element {
  const { openSidebar } = useSidebar();
  const [popoverOpen, setPopoverOpen] = useState(false);
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
      setPopoverOpen(false);
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
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="hidden md:flex cursor-pointer items-start">
              <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-2 space-y-1">

              {/* Move to List */}
              <div className="p-2">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Move to list
                </label>
                <Select
                  onValueChange={(listId) => {
                    moveTodoMutation.mutate({
                      todoId: todo.id,
                      listId: parseInt(listId),
                    });
                  }}
                >
                  <SelectContent>
                    {lists
                      .filter((list) => list.id !== todo.list_id)
                      .map((list) => (
                        <SelectItem key={list.id} value={list.id.toString()}>
                          {list.name}
                        </SelectItem>
                      ))}
                    {lists.filter((list) => list.id !== todo.list_id)
                      .length === 0 && (
                      <option disabled className="text-xs text-muted-foreground">
                        No other lists available
                      </option>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

                {/* Mark as completed */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setPopoverOpen(false);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setPopoverOpen(false);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>

              {/* Don't forget to push to set sidebar open */}

              {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setPopoverOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
            </div>
          </PopoverContent>
        </Popover>
    </li>
  );
}

export default TodoListItem;
