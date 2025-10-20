"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  format,
  subMonths,
  eachDayOfInterval,
  getMonth,
  isSameMonth,
  startOfWeek,
  addDays,
} from "date-fns";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarHeatmap({ data = {} }) {
  // Only show 6 months history
  const today = new Date();
  const startDate = subMonths(today, 6); // start 6 months back
  // Align start to Monday to create week columns like GitHub/LeetCode
  const alignedStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const weeks = [];
  for (let w = alignedStart; w <= today; w = addDays(w, 7)) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(w, d);
      // If day is beyond today, push null to keep grid consistent
      week.push(day > today ? null : day);
    }
    weeks.push(week);
  }

  // Month labels: show only above the first week that contains a new month
  const monthLabels = Array(weeks.length).fill("");
  let lastMonth = null;
  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];
    const firstValidDay = week.find((d) => d instanceof Date && d <= today);
    if (firstValidDay) {
      const m = getMonth(firstValidDay);
      if (m !== lastMonth) {
        monthLabels[i] = format(firstValidDay, "MMM");
        lastMonth = m;
      }
    }
  }

  const colorScale = (val) => {
    if (val >= 12) return "bg-green-800 dark:bg-green-700";
    if (val >= 8) return "bg-green-700 dark:bg-green-600";
    if (val >= 4) return "bg-green-500 dark:bg-green-500";
    if (val >= 1) return "bg-green-300 dark:bg-green-400";
    return "bg-muted";
  };

  const total = Object.values(data || {}).reduce((s, v) => s + (Number(v) || 0), 0);

  return (
    <div className="bg-card p-3 rounded-md max-w-8xl overflow-x-auto border border-border">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Submission Calendar</h3>
        
      </div>

      <div className="flex">
        {/* Weekday labels */}
       

        {/* Weeks */}
        <div className="flex gap-2 items-start">
          {weeks.map((week, i) => (
            <div key={`week-${i}`} className="flex flex-col gap-2">
              {week.map((date, dayIdx) => {
                const formatted = date instanceof Date && !isNaN(date.getTime()) ? format(date, "yyyy-MM-dd") : "";
                const count = formatted ? data[formatted] || 0 : 0;
                return (
                  <TooltipProvider key={formatted + dayIdx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-5 h-5 rounded-sm ${formatted ? colorScale(count) : 'bg-transparent'} border ${formatted ? 'border-border' : 'border-transparent'} hover:scale-105 transform transition-all`}
                          aria-label={`${count} problems`}
                          title={`${count} problems on ${formatted ? format(date, 'MMM d, yyyy') : 'N/A'}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="text-sm">
                          <div className="font-medium">{count} problem{count !== 1 ? 's' : ''}</div>
                          <div className="text-xs text-muted-foreground">{formatted ? format(date, 'EEEE, MMM d, yyyy') : 'N/A'}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              {/* month label if present for this week */}
              {monthLabels[i] ? (
                <div className="text-xs text-muted-foreground mt-1 text-center">{monthLabels[i]}</div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <div className="text-muted-foreground">Less</div>
        <div className="w-5 h-5 bg-muted border border-border rounded-sm" />
        <div className="w-5 h-5 bg-green-300 dark:bg-green-400 border border-border rounded-sm" />
        <div className="w-5 h-5 bg-green-500 dark:bg-green-500 border border-border rounded-sm" />
        <div className="w-5 h-5 bg-green-700 dark:bg-green-600 border border-border rounded-sm" />
        <div className="text-muted-foreground">More</div>
      </div>
    </div>
  );
}
