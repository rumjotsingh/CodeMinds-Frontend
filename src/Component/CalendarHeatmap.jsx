"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, subDays, startOfWeek } from "date-fns";

export default function CalendarHeatmap({ data = {} }) {
  const today = new Date();
  const startDate = subDays(today, 364); // Last 52 weeks

  // Create 53 weeks × 7 days (each week is a column)
  const weeks = Array.from({ length: 53 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = subDays(
        today,
        364 - (weekIndex * 7 + dayIndex)
      );
      const formatted = format(date, "yyyy-MM-dd");

      return {
        date: formatted,
        count: data[formatted] || 0,
      };
    });
  });

  const colorScale = (val) => {
    if (val >= 5) return "bg-green-600";
    if (val >= 3) return "bg-green-500";
    if (val >= 1) return "bg-green-300";
    return "bg-gray-200";
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Streak Calendar</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map(({ date, count }, dIdx) => (
              <TooltipProvider key={date}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-3.5 h-3.5 rounded-sm transition-colors duration-200 ${colorScale(count)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {count} problem{count !== 1 ? "s" : ""} on {date}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
