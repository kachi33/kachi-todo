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
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
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
              className="stroke-green-500"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${completionPercentage}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{
                transition: 'stroke-dasharray 0.5s ease-out'
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-foreground">
              {stats.completed_todos}/{stats.total_todos}
            </div>
            <div className="text-xs text-muted-foreground">
              completed
            </div>
          </div>
        </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>

                    <p className="text-muted-foreground mb-6">
              Track your productivity and stay on top of your tasks
            </p>

      </div>

    </div>
  );
};

export default ProgressChart;