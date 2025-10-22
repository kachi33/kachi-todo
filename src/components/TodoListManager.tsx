import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchTodoLists, createTodoList, deleteTodoList } from "@/lib/api";
import { TodoList, CreateTodoListData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TodoListManagerProps {
  selectedListId: number | null;
  onSelectList: (listId: number) => void;
}

const colors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
];

const TodoListManager = ({ selectedListId, onSelectList }: TodoListManagerProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  const queryClient = useQueryClient();

  const { data: todoLists = [], isLoading } = useQuery<TodoList[]>({
    queryKey: ["todoLists"],
    queryFn: fetchTodoLists,
  });

  const createListMutation = useMutation({
    mutationFn: (listData: CreateTodoListData) => createTodoList(listData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      setShowCreateDialog(false);
      setNewListName('');
      setSelectedColor('blue');
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (listId: number) => deleteTodoList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleCreateList = () => {
    if (newListName.trim()) {
      createListMutation.mutate({
        name: newListName.trim(),
        color: selectedColor,
      });
    }
  };

  const handleDeleteList = (listId: number) => {
    if (todoLists.length > 1) {
      deleteListMutation.mutate(listId);
      if (selectedListId === listId) {
        const nextList = todoLists.find(list => list.id !== listId);
        if (nextList) onSelectList(nextList.id);
      }
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

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading lists...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Your Lists</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Todo List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="List name (e.g., Work, Personal, Shopping)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Choose a color:</p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setSelectedColor(color.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                  Create List
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {todoLists.map((list) => (
          <div
            key={list.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedListId === list.id
                ? 'bg-accent border-primary'
                : 'bg-card border-border hover:bg-accent'
            }`}
            onClick={() => onSelectList(list.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getColorClass(list.color)}`} />
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-card-foreground">{list.name}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {list.todo_count}
              </span>
            </div>
            {todoLists.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoListManager;