"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodoList } from "@/lib/api";
import { CreateTodoListData, TodoList } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#6B7280", // gray
  "#14B8A6", // teal
];

export default function CreateList({ open, onOpenChange }: CreateListProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTodoListData) => createTodoList(data),
    onSuccess: (newList: TodoList) => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      toast.success("List created successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to create list. Please try again.");
      console.error("Error creating list:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      color: selectedColor,
    });
  };

  const handleClose = () => {
    setName("");
    setSelectedColor(PRESET_COLORS[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list to organize your tasks. Choose a name and color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                placeholder="e.g., Personal, Work, Shopping"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
