import { useState } from "react";
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
import { createTodo } from "@/lib/api";
import { CirclePlus } from 'lucide-react';
import { CreateTodoProps } from "@/types";

interface CreateTodoPropsWithList extends CreateTodoProps {
  selectedListId: number;
}

function CreateTodo({ onCreate, selectedListId }: CreateTodoPropsWithList): React.JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!title.trim() || !selectedListId) return;

    setIsLoading(true);
    setError(null);

    try {
      const newTodo = await createTodo({
        title,
        list_id: selectedListId,
        completed: false
      });
      setTitle("");
      onCreate && onCreate(newTodo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="default" className="" disabled={isLoading}>
                <CirclePlus />

          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="">
            <DialogTitle className="">Create Todo</DialogTitle>
            <DialogDescription className="">Add a new task to your todo list.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="" htmlFor="title">Title</Label>
              <Input
                type="text"
                className=""
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Walk the dog"
                required
                disabled={isLoading}
              />
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
              {isLoading ? "Adding..." : "Add Todo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTodo;
