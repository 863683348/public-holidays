import { getTranslations } from "next-intl/server";
import type { Holiday } from "@/lib/types";
import MonthCalendar from "./MonthCalendar";

export default async function YearCalendar({
  holidays,
  year,
}: {
  holidays: Holiday[];
  year: number;
}) {
  const t = await getTranslations("calendar");
  const months = t.raw("months") as string[];
  const weekdays = t.raw("weekdays") as string[];

  const byMonth = Array.from({ length: 12 }, (_, m) =>
    holidays.filter(
      (h) => new Date(`${h.date}T00:00:00Z`).getUTCMonth() === m
    )
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {byMonth.map((hs, m) => (
        <MonthCalendar
          key={m}
          year={year}
          month={m}
          holidays={hs}
          months={months}
          weekdays={weekdays}
        />
      ))}
    </div>
  );
}
