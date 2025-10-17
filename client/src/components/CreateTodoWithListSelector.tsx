import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { createTodo, fetchTodoLists } from "@/lib/api";
import { CirclePlus } from 'lucide-react';
import { CreateTodoProps, TodoList } from "@/types";

function CreateTodoWithListSelector({ onCreate }: CreateTodoProps): React.JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: todoLists = [] } = useQuery<TodoList[]>({
    queryKey: ["todoLists"],
    queryFn: fetchTodoLists,
  });

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
      setSelectedListId(null);
      onCreate && onCreate(newTodo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          <CirclePlus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a task to one of your lists.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Buy groceries, Finish report"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Select List</Label>
              <div className="grid gap-2">
                {todoLists.map((list) => (
                  <div
                    key={list.id}
                    className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${
                      selectedListId === list.id
                        ? 'border-primary bg-accent'
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <div className={`w-3 h-3 rounded-full ${getColorClass(list.color)}`} />
                    <span className="font-medium">{list.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {list.todo_count} tasks
                    </span>
                  </div>
                ))}
              </div>
              {todoLists.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No lists available. Create a list first to add tasks.
                </p>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !selectedListId}
            >
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTodoWithListSelector;