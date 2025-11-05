import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { MoreVertical, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types";
import { TaskItem } from "@/components/TaskItem";
import OfflineStatus from "./OfflineStatus";
import { deleteTodo, createTodo } from "@/lib/offlineApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SidebarProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ todo, isOpen, onClose }: SidebarProps) => {
  const isEditMode = todo !== null;
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!todo) return;

    if (!confirm("Are you sure you want to move this task to trash?")) {
      return;
    }

    try {
      await deleteTodo(todo.id);
      toast.success("Task moved to trash");

      // Invalidate queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      await queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      await queryClient.invalidateQueries({ queryKey: ["userStats"] });

      // Close the sidebar
      onClose();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task:", error);
    }
  };

  const handleDuplicate = async () => {
    if (!todo) return;

    try {
      await createTodo({
        title: `${todo.title} (Copy)`,
        detail: todo.detail,
        priority: todo.priority,
        due_date: todo.due_date,
        due_time: todo.due_time,
        list_id: todo.list_id,
        completed: false,
      });
      toast.success("Task duplicated successfully");

      // Invalidate queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      await queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      await queryClient.invalidateQueries({ queryKey: ["userStats"] });

      // Close the sidebar
      onClose();
    } catch (error) {
      toast.error("Failed to duplicate task");
      console.error("Failed to duplicate task:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-80 lg:w-[450px] sm:max-w-none flex flex-col h-full"
      >
        <SheetHeader className="flex items-start pl-10 pt-6 pb-2">
          <VisuallyHidden>
            <SheetTitle className="">{isEditMode ? "Edit Task" : "Create New Task"}</SheetTitle>
            <SheetDescription className="">
              {isEditMode ? "Edit your task details below" : "Create a new task by filling in the details below"}
            </SheetDescription>
          </VisuallyHidden>
          <div className="flex w-full items-end justify-end">

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="" align="end">
                {/* Duplicate Task */}
                {isEditMode && (
                  <>
                    <DropdownMenuItem className="" inset={false} onClick={handleDuplicate}>
                      <Copy className="h-4 w-4" />
                      <span>Duplicate task</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className=""/>
                  </>
                )}


                {/* Delete */}
                {isEditMode && (
                  <>
                    <DropdownMenuItem className="" inset={false} variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                      <span>Move to trash</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto lg:px-6 px-2">
          <TaskItem todo={todo} onClose={onClose} />
        </div>

        <SheetFooter className="shrink-0 px-6 py-2 border-t flex flex-row items-center justify-between">
          <OfflineStatus />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
