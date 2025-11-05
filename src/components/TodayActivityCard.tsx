import { ProductivityStats } from "@/types";
import { Plus, CheckCircle2 } from "lucide-react";

interface TodayActivityCardProps {
  stats: ProductivityStats;
}

const TodayActivityCard = ({ stats }: TodayActivityCardProps) => {
  const created = stats.todos_created_today;
  const completed = stats.todos_completed_today;

  // Calculate completion percentage
  const percentage = created > 0 ? Math.round((completed / created) * 100) : 0;

  // Get dynamic message
  const getMessage = () => {
    if (created === 0) return "No data yet. Create and complete task for data";
    if (completed === 0) return "Get started on your tasks!";
    if (completed === created) return "All tasks completed! 🎉";
    return "Keep up the momentum!";
  };

  // Get progress bar color based on percentage
  const getProgressColor = () => {
    if (percentage >= 67) return "from-green-500 to-emerald-500";
    if (percentage >= 34) return "from-yellow-500 to-amber-500";
    return "from-red-500 to-orange-500";
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[280px]">
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Today's Progress
      </h3>

      {/* Stats Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-primary mb-2">
          {completed} of {created} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-6">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          {percentage}%
        </div>
      </div>

      {/* Motivational Message */}
      <p className="text-center text-muted-foreground max-w-xs">
        {getMessage()}
      </p>

      {/* Optional: Small visual indicators */}
      {created > 0 && (
        <div className="flex gap-6 mt-6 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus className="w-4 h-4" />
            <span>{created} created</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span>{completed} done</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayActivityCard;
