import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTodo } from "@/lib/api";
import { Todo } from "@/types";

interface EditTodoProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditTodo({ todo, onUpdate, open, onOpenChange }: EditTodoProps): React.JSX.Element {
  const [title, setTitle] = useState<string>(todo.title);
  const [completed, setCompleted] = useState<boolean>(todo.completed);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(todo.title);
    setCompleted(todo.completed);
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedTodo = await updateTodo(todo.id, { title, completed });
      onUpdate(updatedTodo);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="">
            <DialogTitle className="">Edit Todo</DialogTitle>
            <DialogDescription className="">Update your task details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="" htmlFor="edit-title">Title</Label>
              <Input
                type="text"
                className=""
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Walk the dog"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-completed"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={isLoading}
              />
              <Label className="" htmlFor="edit-completed">Mark as completed</Label>
            </div>
            {error && <p className="text-red-600">{error}</p>}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="default" className="" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="default" size="default" className="" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Todo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTodo;