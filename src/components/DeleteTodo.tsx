import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteTodo } from "@/lib/api";
import { Todo } from "@/types";

interface DeleteTodoProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteTodo({ todo, onDelete, open, onOpenChange }: DeleteTodoProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTodo(todo.id);
      onDelete(todo.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="">
          <DialogTitle className="">Delete Todo</DialogTitle>
          <DialogDescription className="">
            Are you sure you want to delete "{todo.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-600 px-6">{error}</p>}

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="default" className="" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size="default"
            className=""
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTodo;