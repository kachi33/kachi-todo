/**
 * Formats a date and time into a human-readable format
 * Handles special cases: "Today", "Tomorrow", "Yesterday"
 * Otherwise: "Sun, Dec 12 at 2pm" or "Mon, Jan 1 at 10:30am"
 */
export function formatDateTime(dateString?: string, timeString?: string): string | null {
  if (!dateString && !timeString) return null;

  const parts: string[] = [];

  if (dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const diffTime = inputDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let dateLabel: string;

    if (diffDays === 0) {
      dateLabel = 'Today';
    } else if (diffDays === 1) {
      dateLabel = 'Tomorrow';
    } else if (diffDays === -1) {
      dateLabel = 'Yesterday';
    } else {
      // Get day of week (short form)
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      // Get month (short form) and day
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      dateLabel = `${dayOfWeek}, ${month} ${day}`;
    }

    parts.push(dateLabel);
  }

  if (timeString) {
    // Convert 24-hour format to 12-hour format with am/pm
    const formattedTime = formatTime(timeString);
    if (formattedTime) {
      parts.push(`at ${formattedTime}`);
    }
  }

  return parts.join(' ') || null;
}

/**
 * Formats time string from HH:MM format to 12-hour format
 * Example: "14:00" -> "2pm", "09:30" -> "9:30am"
 */
export function formatTime(timeString: string): string | null {
  if (!timeString) return null;

  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) return timeString;

  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12; // Convert 0 to 12 for midnight

  // Only show minutes if they're not :00
  if (minutes === 0) {
    return `${hour12}${period}`;
  }

  return `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
}

/**
 * Formats just the date in a user-friendly way
 * Handles special cases: "Today", "Tomorrow", "Yesterday"
 * Otherwise: "Sun, Dec 12"
 */
export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  const diffTime = inputDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  }

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();

  return `${dayOfWeek}, ${month} ${day}`;
}
