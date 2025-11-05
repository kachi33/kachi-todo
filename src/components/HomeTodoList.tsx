import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowRight,
  Plus,
  Divide,
  ListTodo,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/lib/offlineApi";
import { useSidebar } from "@/contexts/SidebarContext";
import { Todo } from "@/types";
import { formatDateTime } from "@/lib/dateUtils";
import TodoListItem from "@/components/TodoListItems";
import OfflineStatus from "./OfflineStatus";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function HomeTodoList(): React.JSX.Element {
  const {
    data: todos = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(),
  });

  const { openSidebar, openCreateMode } = useSidebar();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 lg:gap-6">
        <div className="flex items-center  justify-between">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="text-muted-foreground">
          <Separator className="" />
          <div className="flex justify-end mt-2">
            <OfflineStatus />
          </div>
        </div>
        <div className="space-y-2 p-2 md:px-4">
          <Skeleton className="h-18 w-full rounded-lg" />
          <Skeleton className="h-18 w-full rounded-lg" />
          <Skeleton className="h-18 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3 lg:gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">
            Upcoming Tasks
          </h2>
          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer"
              onClick={openCreateMode}
              title="Create new todo"
            >
              <Plus className="h-4 w-4" />
              Add New Task
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground">
          <Separator className="" />
          <div className="flex justify-end mt-2">
            <OfflineStatus />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-linear-to-br from-card to-card/80 rounded-2xl border border-destructive/50 h-full min-h-[300px]">
          {/* Error Icon */}
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />

          {/* Error Message */}
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Failed to Load Tasks
          </h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            We couldn't retrieve your tasks. Please check your connection and
            try again.
          </p>

          {/* Retry Button */}
          <Button
            onClick={() => refetch()}
            variant="default"
            size="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Filter for pending todos and exclude overdue tasks
  const now = new Date();
  const pendingTodos = todos.filter((todo: Todo) => {
    // Only include incomplete tasks
    if (todo.completed) return false;

    // If there's a due date, check if it's not overdue
    if (todo.due_date) {
      const dueDateTime = new Date(todo.due_date);
      if (todo.due_time) {
        const [hours, minutes] = todo.due_time.split(":");
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // No specific time - treat as end of day (23:59:59)
        dueDateTime.setHours(23, 59, 59, 999);
      }
      // Exclude if overdue (past due date)
      if (dueDateTime < now) return false;
    }

    return true;
  });

  // Sort by due date: upcoming tasks first, then tasks without dates
  const sortedTodos = [...pendingTodos].sort((a: Todo, b: Todo) => {
    // If both have due dates, sort by date (earliest first)
    if (a.due_date && b.due_date) {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      if (a.due_time) {
        const [hours, minutes] = a.due_time.split(":");
        dateA.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // No specific time - treat as end of day for consistent sorting
        dateA.setHours(23, 59, 59, 999);
      }
      if (b.due_time) {
        const [hours, minutes] = b.due_time.split(":");
        dateB.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // No specific time - treat as end of day for consistent sorting
        dateB.setHours(23, 59, 59, 999);
      }
      return dateA.getTime() - dateB.getTime();
    }

    // Tasks with due dates come before tasks without
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;

    // Both have no due dates, maintain original order
    return 0;
  });

  // Show only the first 3 sorted todos
  const recentTodos = sortedTodos.slice(0, 3);
  const hasMoreTodos = sortedTodos.length > 3;

  return (
    <div className="flex flex-col gap-3 lg:gap-6">
      <div className="flex items-center  justify-between">
        <h2 className="text-xl font-semibold text-card-foreground">
          Upcoming Tasks
        </h2>
        <div className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={openCreateMode}
            title="Create new todo"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </Button>
        </div>
      </div>
      <div className="text-muted-foreground">
        <Separator className="" />
        <div className="flex justify-end mt-2">
          <OfflineStatus />
        </div>
      </div>
      {/* <div className="bg-card border border-border rounded-lg p-6"> */}
      {pendingTodos.length === 0 ? (
        <Empty className="from-muted/50 to-background shadow-lg h-full bg-linear-to-b from-30%">
          <EmptyHeader className="">
            <EmptyMedia variant="icon" className="">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle className="">All clear for now</EmptyTitle>
            <EmptyDescription className="">
              {todos.length === 0
                ? "You're all caught up. Take a moment, or plan what's next."
                : "Great job! All your tasks are complete. Ready for more?"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-2 flex flex-row gap-3 items-center justify-center">
            <Button
              variant="default"
              size="default"
              onClick={openCreateMode}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Task
            </Button>

            <Link href="/tasks">
              <Button variant="outline" size="default" className="flex items-center gap-2">
                View all Tasks
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {recentTodos.map((todo: Todo) => (
              <TodoListItem key={todo.id} todo={todo} />
            ))}
          </ul>

          <div className="pt-6 border-t border-border">
            <Link href="/tasks">
              <Button variant="outline" className="w-full" size="sm">
                See All Task
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeTodoList;
