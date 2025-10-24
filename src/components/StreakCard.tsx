import { Flame } from "lucide-react";

interface StreakCardProps {
  streak: number;
}

const StreakCard = ({ streak }: StreakCardProps) => {
  // Generate array of milestone days to show
  const milestoneDays = [1, 3, 7];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-card to-card/80 rounded-2xl border border-border h-full min-h-[300px]">
      {/* Streak Title */}
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-8 w-8 text-orange-500" />
        <h2 className="text-4xl font-bold text-foreground">
          {streak}-day streak
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Milestone Days */}
      <div className="flex gap-8 mb-8">
        {milestoneDays.map((day) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              streak >= day
                ? 'bg-green-500/20 border-2 border-green-500'
                : 'bg-muted border-2 border-border'
            }`}>
              {streak >= day ? (
                <span className="text-2xl">🌱</span>
              ) : (
                <span className="text-2xl opacity-30">🌱</span>
              )}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Day {day}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <p className="text-center text-lg text-muted-foreground max-w-md">
        {streak > 0
          ? "Keep your streak alive today!"
          : "Start your productivity streak today!"}
      </p>
    </div>
  );
};

export default StreakCard;
