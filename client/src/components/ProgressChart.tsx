import { ProductivityStats } from "@/types";

interface ProgressChartProps {
  stats: ProductivityStats;
}

const ProgressChart = ({ stats }: ProgressChartProps) => {
  const completionPercentage = stats.total_todos > 0 ?
    (stats.completed_todos / stats.total_todos) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Completion Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium text-foreground">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Mini Statistics Bars */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">Today's Goal</div>
          <div className="relative">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((stats.todos_completed_today / Math.max(stats.todos_created_today, 1)) * 100, 100)}%`
                }}
              />
            </div>
            <div className="text-xs mt-1 text-foreground font-medium">
              {stats.todos_completed_today}/{stats.todos_created_today}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">Streak</div>
          <div className="relative">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stats.active_streak / 7) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs mt-1 text-foreground font-medium">
              {stats.active_streak} days
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">Score</div>
          <div className="relative">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.total_productivity_score}%` }}
              />
            </div>
            <div className="text-xs mt-1 text-foreground font-medium">
              {stats.total_productivity_score}/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;