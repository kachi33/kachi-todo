import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Todo } from "@/types";
import { TaskItem } from "@/components/TaskItem";

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 lg:w-[430px] sm:max-w-none overflow-y-auto">
        <SheetHeader className="">
          <SheetTitle className="">
            {isEditMode ? "Edit Task" : "New Task"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-6">
          <TaskItem todo={todo} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
