import type { Holiday } from "@/lib/types";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isWeekend(d: Date): boolean {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}

export default function MonthCalendar({
  year,
  month,
  holidays,
}: {
  year: number;
  month: number;
  holidays: Holiday[];
}) {
  const holidayMap = new Map<string, Holiday>();
  for (const h of holidays) holidayMap.set(h.date, h);

  const first = new Date(Date.UTC(year, month, 1));
  const startOffset = (first.getUTCDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
      <h3 className="mb-2 text-center text-sm font-semibold">
        {MONTHS[month]}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--muted)]">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            d
          ).padStart(2, "0")}`;
          const h = holidayMap.get(dateStr);
          const dt = new Date(Date.UTC(year, month, d));
          const weekend = isWeekend(dt);
          return (
            <div
              key={dateStr}
              title={h ? h.name : undefined}
              className={[
                "rounded py-1 text-center text-xs",
                h
                  ? "bg-brand font-semibold text-white"
                  : weekend
                  ? "text-[var(--muted)]"
                  : "",
              ].join(" ")}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
