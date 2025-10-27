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
    <div className="flex flex-col items-center justify-center px-2  min-h-[280px]">
      {/* Mini Chart */}
      <div className="flex items-end gap-3 mb h-">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isHighest = value === maxValue;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
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
      </div>
    </div>
  );
};

export default WeeklyProductivityCard;
