import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export interface FilterOptions {
  priority: string[];
  status: string;
  listId: number | null;
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  availableLists: { id: number; name: string }[];
  children: React.ReactNode;
}

function FilterModal({
  open,
  onOpenChange,
  onApplyFilters,
  currentFilters,
  availableLists,
  children,
}: FilterModalProps): React.JSX.Element {
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    priority: currentFilters.priority || [],
    status: currentFilters.status || "all",
    listId: currentFilters.listId || null,
  });

  useEffect(() => {
    setTempFilters({
      priority: currentFilters.priority || [],
      status: currentFilters.status || "all",
      listId: currentFilters.listId || null,
    });
  }, [currentFilters, open]);

  const handlePriorityToggle = (priority: string) => {
    setTempFilters((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  const handleStatusChange = (status: string) => {
    setTempFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleListChange = (listId: string) => {
    setTempFilters((prev) => ({
      ...prev,
      listId: listId === "all" ? null : parseInt(listId),
    }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priority: [],
      status: "all",
      listId: null,
    };
    setTempFilters(resetFilters);
    onApplyFilters(resetFilters);
    onOpenChange(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const priorities = ["urgent", "high", "medium", "low"];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Filter Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Apply filters to organize your tasks
          </p>
        </div>

        <div className="space-y-6 p-4 max-h-[400px] overflow-y-auto">
          {/* Priority Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Priority</Label>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <Badge
                  key={priority}
                  className={`cursor-pointer transition-all ${getPriorityColor(
                    priority
                  )} ${
                    tempFilters.priority.includes(priority)
                      ? "ring-2 ring-offset-2 ring-primary"
                      : "opacity-60"
                  }`}
                  onClick={() => handlePriorityToggle(priority)}
                >
                  {getPriorityEmoji(priority)}{" "}
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Status</Label>
            <RadioGroup
              value={tempFilters.status}
              onValueChange={handleStatusChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all" className="cursor-pointer">
                  All Tasks
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed" className="cursor-pointer">
                  Completed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label htmlFor="status-pending" className="cursor-pointer">
                  Pending
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* List Filter */}
          {availableLists.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">List</Label>
              <RadioGroup
                value={tempFilters.listId?.toString() || "all"}
                onValueChange={handleListChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="list-all" />
                  <Label htmlFor="list-all" className="cursor-pointer">
                    All Lists
                  </Label>
                </div>
                {availableLists.map((list) => (
                  <div key={list.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={list.id.toString()}
                      id={`list-${list.id}`}
                    />
                    <Label
                      htmlFor={`list-${list.id}`}
                      className="cursor-pointer"
                    >
                      {list.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 p-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterModal;
