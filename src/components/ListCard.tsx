"use client";

import { TodoList } from "@/types";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ListCardProps {
  list: TodoList;
  onEdit: (list: TodoList) => void;
  onDelete: (list: TodoList) => void;
  onClick?: (list: TodoList) => void;
  isActive?: boolean;
}

export default function ListCard({ list, onEdit, onDelete, onClick, isActive }: ListCardProps) {
  return (
    <div
      className={`relative shrink-0 w-[200px] h-[140px] rounded-xl p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
        isActive ? "ring-4 ring-white/50" : ""
      }`}
      style={{ backgroundColor: list.color || "#3B82F6" }}
      onClick={() => onClick?.(list)}
    >
      {/* More Options */}
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-100">
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEdit(list);
              }}
              className=""
              inset={false}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(list);
              }}
              className=""
              inset={false}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List Content */}
      <div className="flex flex-col justify-between h-full text-white">
        <div>
          <p className="text-sm opacity-90 font-medium">{list.todo_count} tasks</p>
        </div>
        <div>
          <h3 className="text-xl font-bold truncate">{list.name}</h3>
        </div>
      </div>
    </div>
  );
}
