import { useState, useEffect, useMemo } from "react";
import { ArrowUpNarrowWide, BadgeIcon, CircleDot, ListStart, ListTree, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo, fetchTodoLists } from "@/lib/offlineApi";
import { Todo, TodoList, CreateTodoData } from "@/types";
import { toast } from "sonner";
import { EnhancedCalendar } from "@/components/EnhancedCalendar";
import { Arrow } from "@radix-ui/react-popover";

// Utility function to format Date to ISO string (YYYY-MM-DD)
const formatDateToISO = (date?: Date) =>
  date ? date.toISOString().split("T")[0] : undefined;

interface TaskItemProps {
  todo: Todo | null;
  onSave?: (todo: Todo) => void;
  onClose?: () => void;
}

export const TaskItem = ({ todo, onSave, onClose }: TaskItemProps) => {
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState("low");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<{
    title: string;
    detail: string;
    dueDate: Date | undefined;
    dueTime: string;
    endTime: string;
    endDate: string | undefined;
    priority: string;
    selectedListId: number | null;
    completed: boolean;
  } | null>(null);

  // Determine if we're in create or edit mode
  const isEditMode = todo !== null;

  // Initialize form when todo changes
  useEffect(() => {
    if (todo) {
      // Edit mode - populate form with todo data
      const parsedDate = todo.due_date ? new Date(todo.due_date) : undefined;
      const initialValues = {
        title: todo.title,
        detail: todo.detail || "",
        dueDate: parsedDate,
        dueTime: todo.due_time || "",
        endTime: todo.end_time || "",
        endDate: todo.end_date || undefined,
        priority: todo.priority,
        selectedListId: todo.list_id || null,
        completed: todo.completed,
      };

      setTitle(initialValues.title);
      setDetail(initialValues.detail);
      setDueDate(initialValues.dueDate);
      setDueTime(initialValues.dueTime);
      setEndTime(initialValues.endTime);
      setEndDate(initialValues.endDate);
      setPriority(initialValues.priority);
      setSelectedListId(initialValues.selectedListId);
      setCompleted(initialValues.completed);
      setOriginalValues(initialValues);
    } else {
      // Create mode - reset form
      setTitle("");
      setDetail("");
      setDueDate(undefined);
      setDueTime("");
      setEndTime("");
      setEndDate(undefined);
      setPriority("low");
      setSelectedListId(null);
      setCompleted(false);
      setOriginalValues(null);
    }
  }, [todo]);

  // Detect if form has changes
  const hasChanges = useMemo(() => {
    if (!isEditMode) {
      // Create mode - show button if title has content
      return title.trim().length > 0;
    }

    // Edit mode - check if any field changed
    if (!originalValues) return false;

    return (
      title !== originalValues.title ||
      detail !== originalValues.detail ||
      dueDate?.getTime() !== originalValues.dueDate?.getTime() ||
      dueTime !== originalValues.dueTime ||
      endTime !== originalValues.endTime ||
      endDate !== originalValues.endDate ||
      priority !== originalValues.priority ||
      selectedListId !== originalValues.selectedListId ||
      completed !== originalValues.completed
    );
  }, [
    title,
    detail,
    dueDate,
    dueTime,
    endTime,
    endDate,
    priority,
    selectedListId,
    completed,
    isEditMode,
    originalValues,
  ]);

  // Fetch todo lists
  const { data: todoLists = [] } = useQuery({
    queryKey: ["todoLists"],
    queryFn: () => fetchTodoLists(),
  });

  const handleSaveTodo = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      const todoData: CreateTodoData = {
        title: title.trim(),
        detail: detail.trim() || undefined,
        due_date: formatDateToISO(dueDate),
        due_time: dueTime || undefined,
        end_time: endTime || undefined,
        end_date: endDate || undefined,
        priority,
        list_id: selectedListId || undefined,
        completed: completed,
      };

      let savedTodo: Todo;

      if (isEditMode && todo) {
        // Update existing todo
        savedTodo = await updateTodo(todo.id, todoData);
        toast.success("Task updated successfully");
      } else {
        // Create new todo
        savedTodo = await createTodo(todoData);
        toast.success("Task created successfully");
      }

      // Refresh todos
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todoLists"] });

      // Call onSave callback with saved todo
      onSave?.(savedTodo);

      // Close
      onClose?.();
    } catch (error) {
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} task:`,
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 bg-green-50 p-2">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className=""></Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isEditMode ? "Edit task" : "New task"}
          className="w-full px-0 shadow-none border-none h-24 placeholder:text-muted-foreground text-3xl! placeholder:text-3xl! align-top outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>

      <div className="space-y-2 pl-6 ">

        {/* Priority */}
        <div className="space-y-2 flex items-center">
          <Label htmlFor="priority" className="w-1/3">
          <ArrowUpNarrowWide className="inline mr-1 h-4 w-4" />
            Priority
          </Label>
          <Select
            id="priority"
            value={priority}
            onValueChange={setPriority}
            className="flex-1 px-2 border-none outline-none text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          >
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </Select>
        </div>

        {/* Date & Time with Duration */}
        <EnhancedCalendar
          date={dueDate}
          startTime={dueTime}
          endTime={endTime}
          endDate={endDate}
          onDateChange={setDueDate}
          onStartTimeChange={setDueTime}
          onEndTimeChange={setEndTime}
          onEndDateChange={setEndDate}
        />

        {/* Status */}
        <div className="space-y-2 flex items-center">
          <Label htmlFor="status" className="w-1/3">
            <CircleDot className="inline mr-1 h-4 w-4" />
            Status
          </Label>
          <div className="flex-1 flex items-center gap-3">
            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                completed
                  ? "bg-green-400 text-green-900"
                  : "bg-yellow-400 text-yellow-900"
              }`}
            >
              {completed ? "Completed" : "Pending"}
            </span>

            {/* Show "Mark as complete" checkbox only in edit mode and if not completed */}
            {isEditMode && !completed && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mark-complete"
                  checked={completed}
                  onCheckedChange={(checked) => {
                    setCompleted(checked as boolean);
                  }}
                />
                <Label htmlFor="mark-complete" className="cursor-pointer text-sm">
                  Mark as complete
                </Label>
              </div>
            )}
          </div>
        </div>


        {/* List Selection */}
        <div className="space-y-2 flex bg-amber-200 items-center">
          <Label htmlFor="list" className="w-1/3">
            <ListTree className="inline mr-1 h-4 w-4" />
            List
          </Label>
          <div className="flex-1">
            <Select
              value={selectedListId?.toString() || ""}
              onValueChange={(value) =>
                setSelectedListId(value ? parseInt(value) : null)
              }
            >
              <SelectTrigger className="w-full border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0">
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not Set</SelectItem>
                {todoLists.map((list: TodoList) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>


        {/* Details */}
        <div className="space-y-2">
          <Label htmlFor="detail" className="">
            Detail
          </Label>
          <Textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Add details..."
            rows={4}
            className="resize-none border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
        </div>

      {/* Save Button - Only show when there are changes */}
      {hasChanges && (
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSaveTodo}
            disabled={!title.trim() || isSaving}
            className="flex-1"
            variant="default"
            size="default"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Save Changes" : "Create Todo"}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
