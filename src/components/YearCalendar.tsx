import type { Holiday } from "@/lib/types";
import MonthCalendar from "./MonthCalendar";

export default function YearCalendar({
  holidays,
  year,
}: {
  holidays: Holiday[];
  year: number;
}) {
  const months = Array.from({ length: 12 }, (_, m) =>
    holidays.filter(
      (h) => new Date(`${h.date}T00:00:00Z`).getUTCMonth() === m
    )
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {months.map((hs, m) => (
        <MonthCalendar key={m} year={year} month={m} holidays={hs} />
      ))}
    </div>
  );
}
