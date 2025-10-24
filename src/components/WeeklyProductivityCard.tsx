import { TrendingUp } from "lucide-react";

interface WeeklyProductivityCardProps {
  weeklyData?: number[];
}

const WeeklyProductivityCard = ({ weeklyData }: WeeklyProductivityCardProps) => {
  // Default data if not provided (represents tasks completed each day)
  const data = weeklyData || [3, 5, 2, 8, 4, 6, 3];
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const maxValue = Math.max(...data);
  const mostProductiveDay = days[data.indexOf(maxValue)];
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mostProductiveDayFull = fullDayNames[data.indexOf(maxValue)];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-linear-to-br from-card to-card/80 rounded-2xl border border-border h-full min-h-[300px]">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-foreground">Weekly Activity</h2>
      </div>

      {/* Mini Chart */}
      <div className="flex items-end gap-3 mb-8 h-32">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isHighest = value === maxValue;

          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isHighest
                      ? 'bg-linear-to-t from-blue-500 to-blue-400'
                      : 'bg-linear-to-t from-muted-foreground/40 to-muted-foreground/20'
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              {/* Day Label */}
              <span className={`text-sm font-medium ${
                isHighest ? 'text-blue-500' : 'text-muted-foreground'
              }`}>
                {days[index]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div className="text-center max-w-md">
        <p className="text-lg text-foreground mb-1">
          You were most productive on{" "}
          <span className="font-bold text-blue-500">{mostProductiveDayFull}</span>!
        </p>
        <p className="text-sm text-muted-foreground">
          {maxValue} tasks completed
        </p>
      </div>
    </div>
  );
};

export default WeeklyProductivityCard;
