import { useMemo } from "react";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IYearlyStreakDay } from "@/@types/interface/progress.interface";
import { useYearlyStreak } from "@/hooks/useYearlyStreak";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Rows: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
const DAY_ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getCellClass(attempts: number): string {
  if (attempts === 0) return "bg-border";
  if (attempts === 1) return "bg-primary/25";
  if (attempts <= 3) return "bg-primary/50";
  if (attempts <= 5) return "bg-primary/75";
  return "bg-primary";
}

export function YearlyStreakHeatmap() {
  const { data: streak, isLoading } = useYearlyStreak();

  const { weeks, monthLabels } = useMemo(() => {
    if (!streak) return { weeks: [], monthLabels: [] };
    const sorted = [...streak.days].sort((a, b) => a.date.localeCompare(b.date));
    if (!sorted.length) return { weeks: [], monthLabels: [] };

    // Pad start so column 0 begins on Sunday
    const firstDow = new Date(sorted[0].date).getDay(); // 0=Sun
    const cells: (IYearlyStreakDay | null)[] = [
      ...Array(firstDow).fill(null),
      ...sorted,
    ];
    // Pad end to complete the last week
    while (cells.length % 7 !== 0) cells.push(null);

    // Split into 7-day columns (each column = 1 week, rows = days)
    const weeksArr: (IYearlyStreakDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeksArr.push(cells.slice(i, i + 7));

    // Month label: place at first week where the month changes
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, wi) => {
      const firstReal = week.find(Boolean) as IYearlyStreakDay | undefined;
      if (firstReal) {
        const m = new Date(firstReal.date).getMonth();
        if (m !== lastMonth) {
          labels.push({ label: MONTHS[m], col: wi });
          lastMonth = m;
        }
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, [streak]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!streak) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            Activity Streak
          </CardTitle>

          {/* Stats row */}
          <div className="flex gap-5 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-primary text-xl leading-tight">{streak.currentStreak}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">Current Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-xl leading-tight">{streak.longestStreak}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">Longest Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-xl leading-tight">{streak.totalActiveDays}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">Active Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-xl leading-tight">{streak.totalAttempts}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">Total Attempts</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex flex-col gap-0.75 min-w-max">

            {/* Month labels row */}
            <div className="flex gap-0.75 ml-8">
              {weeks.map((_, wi) => {
                const found = monthLabels.find((m) => m.col === wi);
                return (
                  <div key={wi} className="w-3 text-[10px] text-muted-foreground leading-none overflow-visible whitespace-nowrap">
                    {found?.label ?? ""}
                  </div>
                );
              })}
            </div>

            {/* Main grid row */}
            <div className="flex gap-0.75">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-0.75 w-7 pr-1 shrink-0">
                {DAY_ROW_LABELS.map((label, i) => (
                  <div key={i} className="h-3 flex items-center justify-end text-[10px] text-muted-foreground leading-none">
                    {label}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.75">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={
                        day
                          ? `${day.date}: ${day.attempts} attempt${day.attempts !== 1 ? "s" : ""}`
                          : undefined
                      }
                      className={[
                        "w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-default",
                        day ? getCellClass(day.attempts) : "opacity-0",
                      ].join(" ")}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-1 justify-end">
              <span className="text-[10px] text-muted-foreground">Less</span>
              {[0, 1, 2, 4, 6].map((n) => (
                <div key={n} className={`w-3 h-3 rounded-sm ${getCellClass(n)}`} />
              ))}
              <span className="text-[10px] text-muted-foreground">More</span>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
