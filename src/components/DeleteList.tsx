"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodoList } from "@/lib/api";
import { TodoList } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteListProps {
  list: TodoList | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteList({ list, open, onOpenChange }: DeleteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodoList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      toast.success("List deleted successfully!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to delete list. Please try again.");
      console.error("Error deleting list:", error);
    },
  });

  const handleDelete = () => {
    if (!list) return;
    deleteMutation.mutate(list.id);
  };

  if (!list) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            This will permanently delete the list "{list.name}" and all its tasks.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel className="" disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
