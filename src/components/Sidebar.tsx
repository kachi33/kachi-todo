import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, MoreHorizontal, Trash2, Info, Copy, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types";
import { TaskItem } from "@/components/TaskItem";
import OfflineStatus from "./OfflineStatus";
import { Separator } from "@/components/ui/separator";
import { deleteTodo } from "@/lib/offlineApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SidebarProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  todo,
  isOpen,
  onClose,
}: SidebarProps) => {
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

      // Close the sidebar
      onClose();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 lg:w-[450px] sm:max-w-none p-4 flex flex-col h-full">
        <SheetHeader className="">
          <div className="flex items-center justify-between">
            <SheetTitle className="">
              {isEditMode ? "Update Task" : "Add a New Task"}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <TaskItem todo={todo} onClose={onClose} />
        </div>
        <SheetFooter className="shrink-0 px-6 py-4 border-t flex flex-row items-center justify-between">
          <OfflineStatus />

          {/* More Actions Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end" side="top">
              <div className="flex flex-col space-y-1">

                {/* Duplicate Task */}
                {isEditMode && (
                  <>
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors text-left"
                      onClick={() => {
                        // Handle duplicate task
                        console.log("Duplicate task");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Duplicate task</span>
                    </button>
                    <Separator className="my-1" />
                  </>
                )}

                {/* Available Offline */}
                {isEditMode && (
                  <>
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors text-left"
                      onClick={() => {
                        // Handle available offline toggle
                        console.log("Toggle available offline");
                      }}
                    >
                      <WifiOff className="h-4 w-4" />
                      <span>Available offline</span>
                    </button>
                    <Separator className="my-1" />
                  </>
                )}

                {/* Delete */}
                {isEditMode && (
                  <>
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded transition-colors text-left"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Move to trash</span>
                    </button>
                    <Separator className="my-1" />
                  </>
                )}

                {/* Metadata */}
                {isEditMode && todo && (
                  <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      <span>Metadata</span>
                    </div>
                    <div className="ml-5 space-y-0.5">
                      <p>Created: {new Date(todo.created_at).toLocaleDateString()}</p>
                      {todo.updated_at && (
                        <p>Last Edited at: {new Date(todo.updated_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
