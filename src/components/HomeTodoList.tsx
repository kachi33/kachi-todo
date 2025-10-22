import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/lib/offlineApi";
import { useSidebar } from "@/contexts/SidebarContext";
import { Todo } from "@/types";
import { formatDateTime } from "@/lib/dateUtils";
import TodoListItem from "@/components/TodoListItems";

function HomeTodoList(): React.JSX.Element {
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(),
  });

  const { openSidebar, openCreateMode } = useSidebar();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTODOStatusColor = (completed: boolean) => {
    return completed ? "border-l-green-500" : "border-l-yellow-500";
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

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Recent Tasks
        </h2>
        <div className="text-muted-foreground">Loading todos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Recent Tasks
        </h2>
        <div className="text-destructive">Error loading todos</div>
      </div>
    );
  }

  // Show only the first 3 todos
  const recentTodos = todos.slice(0, 3);
  const hasMoreTodos = todos.length > 3;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Recent Tasks
        </h2>
        {/* {todos.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {todos.length} total task{todos.length !== 1 ? 's' : ''}
          </span>
        )} */}
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={openCreateMode}
          title="Create new todo"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <h3 className="text-lg font-medium text-foreground mb-2">
              No tasks yet
            </h3>
            <p>Create your first task to get started!</p>
          </div>
          <Link href="/todos">
            <Button>Create Your First Task</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {recentTodos.map((todo: Todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
              />
            ))}
          </ul>

          {hasMoreTodos && (
            <div className="pt-4 border-t border-border">
              <Link href="/todos">
                <Button variant="outline" className="w-full" size="sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  See More ({todos.length - 3} more task
                  {todos.length - 3 !== 1 ? "s" : ""})
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeTodoList;
