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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { createTodo, fetchTodoLists } from "@/lib/api";
import { CirclePlus } from 'lucide-react';
import { CreateTodoProps, TodoList } from "@/types";

function CreateTodoWithListSelector({ onCreate }: CreateTodoProps): React.JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
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
        detail: detail || undefined,
        priority,
        due_date: dueDate || undefined,
        due_time: dueTime || undefined,
        list_id: selectedListId,
        completed: false
      });
      setTitle("");
      setDetail("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
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

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
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
              <Label htmlFor="detail">Description (Optional)</Label>
              <Textarea
                id="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Add more details about this task..."
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isLoading}>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">Due Time (Optional)</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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