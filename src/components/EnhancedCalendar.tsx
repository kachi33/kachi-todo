"use client";

import * as React from "react";
import { Calendar1, ChevronDownIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedCalendarProps {
  date?: Date;
  startTime?: string;
  endTime?: string;
  endDate?: string;
  onDateChange?: (date: Date | undefined) => void;
  onStartTimeChange?: (time: string) => void;
  onEndTimeChange?: (time: string) => void;
  onEndDateChange?: (date: string | undefined) => void;
}

// Duration options in minutes
const DURATION_OPTIONS = [
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
  { label: "4 hours", value: 240 },
  { label: "5 hours", value: 300 },
  { label: "6 hours", value: 360 },
  { label: "8 hours", value: 480 },
  { label: "Custom", value: -1 },
];

// Utility function to add minutes to a time string
const addMinutesToTime = (
  timeString: string,
  minutes: number
): { time: string; nextDay: boolean } => {
  const [hours, mins] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;

  const nextDay = totalMinutes >= 24 * 60;
  const adjustedMinutes = totalMinutes % (24 * 60);

  const newHours = Math.floor(adjustedMinutes / 60);
  const newMins = adjustedMinutes % 60;

  return {
    time: `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
      2,
      "0"
    )}`,
    nextDay,
  };
};

// Format date for display
const formatDateDisplay = (
  date?: Date,
  startTime?: string,
  endTime?: string,
  endDate?: string
) => {
  if (!date) return "Not Set";

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!startTime) return dateStr;

  if (!endTime) return `${dateStr} ${startTime}`;

  if (endDate) {
    const endDateObj = new Date(endDate);
    const endDateStr = endDateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${dateStr} ${startTime} - ${endDateStr} ${endTime}`;
  }

  return `${dateStr} ${startTime} - ${endTime}`;
};

export function EnhancedCalendar({
  date,
  startTime,
  endTime,
  endDate,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onEndDateChange,
}: EnhancedCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDuration, setSelectedDuration] = React.useState<string>("");
  const [isCustomDuration, setIsCustomDuration] = React.useState(false);
  const [spansMultipleDays, setSpansMultipleDays] = React.useState(false);
  const [showTimeSelector, setShowTimeSelector] = React.useState(false);

  // Update spans multiple days when endDate changes
  React.useEffect(() => {
    setSpansMultipleDays(!!endDate);
  }, [endDate]);

  // Initialize showTimeSelector based on whether startTime exists
  React.useEffect(() => {
    if (startTime) {
      setShowTimeSelector(true);
    }
  }, [startTime]);

  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);

    if (value === "-1") {
      // Custom duration selected
      setIsCustomDuration(true);
      return;
    }

    if (!startTime || !date) return;

    setIsCustomDuration(false);
    const durationMinutes = parseInt(value);
    const { time: newEndTime, nextDay } = addMinutesToTime(
      startTime,
      durationMinutes
    );

    onEndTimeChange?.(newEndTime);

    // Handle overnight scenarios
    if (nextDay) {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      onEndDateChange?.(tomorrowStr);
      setSpansMultipleDays(true);
    } else if (!spansMultipleDays) {
      // Clear end date if not spanning multiple days and not manually set
      onEndDateChange?.(undefined);
    }
  };

  const handleStartTimeChange = (time: string) => {
    onStartTimeChange?.(time);

    // Recalculate end time if a duration is selected (and not custom)
    if (selectedDuration && selectedDuration !== "-1" && date) {
      const durationMinutes = parseInt(selectedDuration);
      const { time: newEndTime, nextDay } = addMinutesToTime(
        time,
        durationMinutes
      );
      onEndTimeChange?.(newEndTime);

      if (nextDay) {
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        onEndDateChange?.(tomorrowStr);
        setSpansMultipleDays(true);
      }
    }
  };

  const handleMultipleDaysToggle = () => {
    const newValue = !spansMultipleDays;
    setSpansMultipleDays(newValue);

    if (!newValue) {
      // Unchecked - clear end date
      onEndDateChange?.(undefined);
    } else if (date) {
      // Checked - set end date to tomorrow by default
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      onEndDateChange?.(tomorrowStr);
    }
  };

  const handleClear = () => {
    onDateChange?.(undefined);
    onStartTimeChange?.("");
    onEndTimeChange?.("");
    onEndDateChange?.(undefined);
    setSelectedDuration("");
    setIsCustomDuration(false);
    setSpansMultipleDays(false);
  };

  return (
    <div className="flex item-center justify-between gap-2 ">
      <Label htmlFor="date-time-picker" className="w-1/3">
        <Calendar1 className="inline mr-1 h-4 w-4" />
        Due
      </Label>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="flex-1">
          <Button
            variant="ghost"
            size="default"
            id="date-time-picker"
            className="w-full justify-between text-muted-foreground font-normal border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent px-0"
          >
            {formatDateDisplay(date, startTime, endTime, endDate)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            {/* Calendar */}
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              startMonth={new Date()}
              endMonth={new Date(new Date().getFullYear() + 10, 11, 31)}
              disabled={{ before: new Date() }}
              onSelect={(selectedDate) => {
                onDateChange?.(selectedDate);
              }}
            />

            {/* Time inputs and duration selector */}
            <div className="border-t bg-amber-50 p-4 space-y-3">
              {/* Set Time Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Set time</Label>
                  <Switch
                    checked={showTimeSelector}
                    onCheckedChange={(checked) => {
                      setShowTimeSelector(checked);
                      if (!checked) {
                        // Clear time values when switch is turned off
                        onStartTimeChange?.("");
                        onEndTimeChange?.("");
                        onEndDateChange?.(undefined);
                        setSelectedDuration("");
                        setIsCustomDuration(false);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Show time-related inputs only when switch is on */}
              {showTimeSelector && (
                <>
                  {/* Start Time */}
                  <div className="space-y-2 w-full bg-green-50 flex items-baseline justify-between">
                    <Label htmlFor="start-time" className="text-sm w-1/3">
                      {" "}
                      Due
                    </Label>
                    <Input
                      type="time"
                      id="start-time"
                      value={startTime || ""}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      className="flex-1 shadow-none border-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-noneoutline-none text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    />
                  </div>

                  {/* Duration Selector */}
                  {startTime && (
                    <div className="space-y-2 w-full bg-green-50 flex items-baseline justify-between">
                      <Label htmlFor="duration" className="text-sm w-1/3">
                        Duration
                      </Label>
                      <Select
                        id="duration"
                        value={selectedDuration}
                        onValueChange={handleDurationChange}
                        className="flex-1 shadow-none border-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-noneoutline-none text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      >
                        <SelectItem value="">In...</SelectItem>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* End Time */}
                  {startTime && (
                    <div className="space-y-2">
                      <Label htmlFor="end-time" className="text-sm">
                        End Time
                      </Label>
                      <Input
                        type="time"
                        id="end-time"
                        value={endTime || ""}
                        onChange={(e) => onEndTimeChange?.(e.target.value)}
                        disabled={!isCustomDuration && selectedDuration !== ""}
                        className="w-full"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Spans multiple days checkbox */}
              {startTime && endTime && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="multi-day"
                    checked={spansMultipleDays}
                    onChange={handleMultipleDaysToggle}
                    className="rounded"
                  />
                  <Label htmlFor="multi-day" className="text-sm cursor-pointer">
                    Spans multiple days
                  </Label>
                </div>
              )}

              {/* End Date (only if spans multiple days) */}
              {spansMultipleDays && date && (
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    id="end-date"
                    value={endDate || ""}
                    onChange={(e) => onEndDateChange?.(e.target.value)}
                    min={date.toISOString().split("T")[0]}
                    className="w-full"
                  />
                </div>
              )}

              {/* Clear Button */}
              {(date || startTime || endTime || endDate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="w-full mt-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
