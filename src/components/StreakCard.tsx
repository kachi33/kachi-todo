"use client";

import { ProductivityStats } from "@/types";
import { Flame, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface StreakCardProps {
  stats: ProductivityStats;
}

const StreakCard = ({ stats }: StreakCardProps) => {
  const streak = stats.active_streak;
  const [message, setMessage] = useState("");

  // Get random motivational message
  useEffect(() => {
    const messages = [
      "You are doing really great!",
      "Keep up the amazing work!",
      "You're on fire!",
      "Fantastic progress!",
      "You're crushing it!",
      "Stay consistent!",
      "Incredible dedication!",
    ];

    // Special message for streak = 0
    if (streak === 0) {
      setMessage("Start a new streak today!");
    } else {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [streak]);

  // Get dynamic streak text
  const getStreakText = () => {
    if (streak <= 1) return "Day Streak";
    if (streak >= 2 && streak <= 6) return "Days Streak";
    if (streak >= 7 && streak <= 29) return "Week Streak";
    return "Month Streak"; // 30+
  };

  // Get current week dates (Monday to Sunday)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate Monday of current week
    const monday = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(today.getDate() + diff);

    // Generate 7 days starting from Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  // Check if a date should show checkmark
  const shouldShowCheckmark = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Don't show checkmark for future dates
    if (checkDate > today) return false;

    // Calculate how many days ago this date was
    const daysAgo = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));

    // Show checkmark if within streak range
    return daysAgo < streak;
  };

  const weekDates = getCurrentWeekDates();
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex flex-col items-center space-y-2 max-h-[280px] justify-center">
      {/* Flame Icon + Streak Number */}
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-100 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 flex items-center justify-center shadow-lg">
          <Flame className={`w-12 h-12 ${streak === 0 ? 'text-muted-foreground/40' : 'text-orange-500'}`} />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-foreground">{streak}</span>   {getStreakText()}

        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="flex gap-3">
        {weekDates.map((date, index) => {
          const hasCheckmark = shouldShowCheckmark(date);
          return (
            <div key={index} className="flex flex-col items-center">
              {/* Checkmark or Date Number */}
              {hasCheckmark ? (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground ">
                {dayLabels[index]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

            {/* Motivational Message */}
      <p className="text-sm text-muted-foreground mb-2 text-center">
        {message}
      </p>

    </div>
  );
};

export default StreakCard;
