"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodoList, updateTodoList } from "@/lib/api";
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
  list?: TodoList | null;
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

export default function CreateList({
  list,
  open,
  onOpenChange,
}: CreateListProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const isEditMode = !!list;

  // Update form when list prop changes
  useEffect(() => {
    if (list) {
      setName(list.name);
      setSelectedColor(list.color || PRESET_COLORS[0]);
    } else {
      setName("");
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [list]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTodoListData) => createTodoList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      toast.success("List created successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to create list. Please try again.");
      console.error("Error creating list:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTodoListData>;
    }) => updateTodoList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("List updated successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to update list. Please try again.");
      console.error("Error updating list:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    if (isEditMode && list) {
      updateMutation.mutate({
        id: list.id,
        data: {
          name: name.trim(),
          color: selectedColor,
        },
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
        color: selectedColor,
      });
    }
  };

  const handleClose = () => {
    setName("");
    setSelectedColor(PRESET_COLORS[0]);
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="">
          <DialogTitle className="">
            {isEditMode ? "Edit List" : "Create New List"}
          </DialogTitle>
          <DialogDescription className="">
            {isEditMode
              ? "Update the list name and color."
              : "Create a new list to organize your tasks. Choose a name and color."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="" htmlFor="name">
                List Name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="e.g., Personal, Work, Shopping"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label className="">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
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
          <DialogFooter className="">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleClose}
              disabled={isPending}
              className=""
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" size="default" disabled={isPending} className="">
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update List"
                : "Create List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
