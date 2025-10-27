import { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowUpNarrowWide,
  BadgeIcon,
  Check,
  CircleDot,
  ListTree,
  Save,
  AlertCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo, fetchTodoLists } from "@/lib/offlineApi";
import { Todo, TodoList, CreateTodoData } from "@/types";
import { toast } from "sonner";
import { EnhancedCalendar } from "@/components/EnhancedCalendar";
import { Separator } from "./ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export type MockState = "loading" | "error" | "empty" | "content" | null;

// Utility function to format Date to ISO string (YYYY-MM-DD)
const formatDateToISO = (date?: Date) =>
  date ? date.toISOString().split("T")[0] : undefined;

interface TaskItemProps {
  todo: Todo | null;
  onSave?: (todo: Todo) => void;
  onClose?: () => void;
  mockState?: MockState;
}

export const TaskItem = ({
  todo,
  onSave,
  onClose,
  mockState = null,
}: TaskItemProps) => {
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

  // Create ref for title input to handle auto-focus
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  // Focus title input when component mounts or todo changes
  useEffect(() => {
    // Small delay to ensure Sheet animation completes and form is initialized
    const timeoutId = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
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
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      await queryClient.invalidateQueries({ queryKey: ["todoLists"] });

      // Call onSave callback with saved todo
      onSave?.(savedTodo);

      // Small delay to ensure UI updates before closing
      await new Promise((resolve) => setTimeout(resolve, 100));

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

  // Mock state rendering
  const showLoading = mockState === "loading";
  const showError = mockState === "error";
  const showEmpty = mockState === "empty";

  if (showLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-linear-to-br from-card to-card/80 rounded-2xl border border-destructive/50 h-full min-h-[300px]">
        <AlertCircle className="h-16 w-16 text-destructive mb-6" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Failed to Load Task
        </h3>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          We couldn't retrieve this task. Please check your connection and try
          again.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          size="default"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (showEmpty) {
    return (
      <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
        <EmptyHeader className="">
          <EmptyMedia className="" variant="icon">
            <CircleDot />
          </EmptyMedia>
          <EmptyTitle className="">No Task Selected</EmptyTitle>
          <EmptyDescription className="">
            Select a task from the list to view details, or create a new one.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className=" text-muted-foreground">
      {/* Title */}
      <div className="">
        <Input
          ref={titleInputRef}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isEditMode ? "Edit task" : "New task"}
          className={`w-full px-2 shadow-none border-none h-24 placeholder:text-muted-foreground/50 text-3xl! placeholder:text-3xl! align-top outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! ${
            title.trim() ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </div>

      <div className="md:ml-10 ml-2 flex flex-col gap-4 md:gap-6">
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

        {/* List Selection */}
        <div className=" flex items-center">
          <Label htmlFor="list" className="w-1/3  ">
            <ListTree className="inline h-4 w-4" />
            List
          </Label>
          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-1/3 justify-between text-left font-normal border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent px-0! ${
                    selectedListId !== null
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>
                    {selectedListId
                      ? todoLists.find((list) => list.id === selectedListId)
                          ?.name || "Not Set"
                      : "Not Set"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]" align="start">
                <DropdownMenuItem
                  className=""
                  inset={false}
                  onClick={() => setSelectedListId(null)}
                >
                  <span>Not Set</span>
                  {!selectedListId && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                {todoLists.map((list: TodoList) => (
                  <DropdownMenuItem
                    key={list.id}
                    className=""
                    inset={false}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <span>{list.name}</span>
                    {selectedListId === list.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status */}
        <div className=" flex items-center">
          <Label htmlFor="status" className="w-1/3">
            <CircleDot className="inline h-4 w-4" />
            Status
          </Label>

          {/* Status and Mark as Complete */}
          <div className="flex-1 flex flex-col md:flex-row  md:gap-3 text-primary">
            <p className="text-sm">
              {completed ? "Completed" : "Pending"}
              <span
                className={`inline-block px-1 py-1 ml-1 rounded-full ${
                  completed ? "bg-green-400" : "bg-yellow-400"
                }`}
              ></span>
            </p>

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
                <Label
                  htmlFor="mark-complete"
                  className="cursor-pointer text-sm"
                >
                  Mark as complete
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Priority */}
        <div className="flex items-center">
          <Label htmlFor="priority" className="w-1/3">
            <ArrowUpNarrowWide className="inline h-4 w-4" />
            Priority
          </Label>
          <div className="flex-1 p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-1/3 justify-between text-left font-normal border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0  hover:bg-transparent px-0! text-primary"
                >
                  <span className="capitalize">{priority}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]" align="start">
                <DropdownMenuItem
                  className=""
                  inset={false}
                  onClick={() => setPriority("urgent")}
                >
                  <span>Urgent</span>
                  {priority === "urgent" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className=""
                  inset={false}
                  onClick={() => setPriority("high")}
                >
                  <span>High</span>
                  {priority === "high" && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className=""
                  inset={false}
                  onClick={() => setPriority("medium")}
                >
                  <span>Medium</span>
                  {priority === "medium" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className=""
                  inset={false}
                  onClick={() => setPriority("low")}
                >
                  <span>Low</span>
                  {priority === "low" && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3 flex-col">
          <Label htmlFor="detail" className="">
            Detail
          </Label>
          <Textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Add details..."
            rows={2}
            className={`resize-none border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent ${
              detail.trim() ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>
      </div>
      <Separator className="my-4" />
      {/* Save Button - Only show when there are changes */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button
            onClick={handleSaveTodo}
            disabled={!title.trim() || isSaving}
            className=""
            variant="default"
            size="default"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>{isEditMode ? "Save Changes" : "Add Task"}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
