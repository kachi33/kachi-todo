import { ProductivityStats } from "@/types";

interface ProgressChartProps {
  stats: ProductivityStats;
}

const ProgressChart = ({ stats }: ProgressChartProps) => {
  const completionPercentage =
    stats.total_todos > 0
      ? (stats.completed_todos / stats.total_todos) * 100
      : 0;

  const isEmpty = stats.total_todos === 0;

  return (
    <div className="flex flex-col items-center space-y-2 md:space-y-4 py-8 px-4 min-h-[280px] justify-center">
        {/* Completion Progress Bar */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-360" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="stroke-muted"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className={isEmpty ? "stroke-muted-foreground/30" : "stroke-green-500"}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${completionPercentage}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{
                transition: "stroke-dasharray 0.5s ease-out",
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-foreground">
              {stats.completed_todos}/{stats.total_todos}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground">Overall Progress</div>

        {/* Dynamic message based on state */}
        <p className="text-center text-muted-foreground max-w-xs mt-2">
          {isEmpty
            ? "Create your first task to track progress!"
            : "Track your productivity and stay on top of your tasks"}
        </p>
      </div>
  );
};

export default ProgressChart;
