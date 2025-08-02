"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, subDays, eachDayOfInterval } from "date-fns";

export default function CalendarHeatmap({ data = {} }) {
  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 364),
    end: today,
  });

  // Chunk into weeks (7-day arrays)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const colorScale = (val) => {
    if (val >= 10) return "bg-green-700";
    if (val >= 5) return "bg-green-600";
    if (val >= 3) return "bg-green-400";
    if (val >= 1) return "bg-green-200";
    return "bg-gray-200";
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Submission Calendar</h3>
      <div className="flex gap-[2px]">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[2px]">
            {week.map((date) => {
              const formatted = format(date, "yyyy-MM-dd");
              const count = data[formatted] || 0;

              return (
                <TooltipProvider key={formatted}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-4 h-4 sm:w-4 sm:h-4 rounded-sm ${colorScale(count)} transition-all`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>
                        {count} problem{count !== 1 ? "s" : ""} on{" "}
                        {format(date, "MMM d, yyyy")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
