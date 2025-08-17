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
} from "date-fns";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarHeatmap({ data = {} }) {
  // Only show 6 months history
  const today = new Date();
  const startDate = subMonths(today, 6); // start 6 months back
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Group days into weeks (Monday-first)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Month labels: show only above the first week with the new month
  const monthLabels = Array(weeks.length).fill("");
  let lastMonth = null;
  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];
    const foundMonthDay = week.find(
      d =>
        d instanceof Date &&
        !isNaN(d.getTime()) &&
        getMonth(d) !== lastMonth
    );
    if (foundMonthDay) {
      const newMonth = getMonth(foundMonthDay);
      monthLabels[i] = format(foundMonthDay, "MMM");
      lastMonth = newMonth;
    }
  }

  const colorScale = (val) => {
    if (val >= 10) return "bg-green-700";
    if (val >= 5) return "bg-green-600";
    if (val >= 3) return "bg-green-400";
    if (val >= 1) return "bg-green-200";
    return "bg-gray-100";
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl max-w-full overflow-x-auto border border-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Submission Calendar (Last 6 Months)
      </h3>
      {/* Month labels row */}
      <div className="flex mb-1 ">
        <div className="w-5" /> {/* Spacer for weekday labels */}
        {monthLabels.map((label, i) => (
          <div
            key={`month-${i}`}
            className="w-[30px] text-md text-gray-400  font-medium"
          >
            {label}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="flex">
        {/* Weekday labels vertically */}
        <div className="flex flex-col gap-[4px] mr-1">
          
        </div>
        {/* Heatmap Squares */}
        <div className="flex gap-[4px]">
          {weeks.map((week, i) => {
            const nextWeek = weeks[i + 1];
            const firstDayCurrent = week[0];
            const firstDayNext = nextWeek && nextWeek ? nextWeek : null;
            const isMonthEnding =
              firstDayNext &&
              firstDayCurrent &&
              !isSameMonth(firstDayCurrent, firstDayNext);

            return (
              <div key={`week-${i}`} className="flex flex-col items-center gap-[1px] space-x-2">
                {/* Squares for days in week */}
                {week.map((date, dayIdx) => {
                  const formatted =
                    date instanceof Date && !isNaN(date.getTime())
                      ? format(date, "yyyy-MM-dd")
                      : "";
                  const count = formatted ? data[formatted] || 0 : 0;
                  return (
                    <TooltipProvider key={formatted + dayIdx}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-4 h-4 rounded-[3px] ${colorScale(count)} border border-gray-100 hover:scale-105 hover:shadow transition-all`}
                            aria-label={`${count} problems`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="left" align="center">
                          <p>
                            {count} problem{count !== 1 ? "s" : ""} on{" "}
                            {formatted
                              ? format(date, "MMM d, yyyy")
                              : "Invalid"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {/* Month end spacer for spacing between months */}
                {isMonthEnding && <div className="h-8" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
