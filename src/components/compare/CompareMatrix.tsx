import { getTranslations } from "next-intl/server";
import { Users, Check } from "lucide-react";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import type { Holiday } from "@/lib/types";
import { formatDateParts } from "./shareUrl";

const cellBase = "px-3 py-1.5 align-top border-b border-[var(--border)]";

/**
 * Server component. Builds the comparison table directly — no useMemo, no
 * client hooks. Sorting / grouping runs once at render time, no React state.
 */
export default async function CompareMatrix({
  matrix,
  locale,
  months,
}: {
  matrix: CompareMatrixData;
  locale: string;
  months: string[];
}) {
  const t = await getTranslations("compare");

  const holidayMaps = matrix.countries.map((c) => {
    const map = new Map<string, Holiday>();
    for (const h of c.holidays) map.set(h.date, h);
    return map;
  });

  const dateSet = new Set<string>();
  for (const c of matrix.countries) for (const h of c.holidays) dateSet.add(h.date);
  const sortedDates = [...dateSet].sort();

  const monthGroups: { month: number; dates: string[] }[] = [];
  for (const date of sortedDates) {
    const m = Number(date.slice(5, 7)) - 1;
    const last = monthGroups[monthGroups.length - 1];
    if (!last || last.month !== m) monthGroups.push({ month: m, dates: [date] });
    else last.dates.push(date);
  }

  if (monthGroups.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
        {t("allOffNone", { year: matrix.year })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg)]">
      <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky start-0 z-10 border-b border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]"
            >
              {t("dateColumn")}
            </th>
            {matrix.countries.map((c) => (
              <th
                key={c.code}
                scope="col"
                className="border-b border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-start text-sm"
              >
                <span className="block font-semibold">{c.name}</span>
                <span className="block text-xs font-normal text-[var(--muted)]">
                  {c.code}
                </span>
                <span className="block text-xs font-normal text-[var(--muted)]">
                  {t("longWeekendCount", {
                    count: matrix.longWeekendCounts[c.code] ?? 0,
                  })}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        {monthGroups.map((group) => {
          const total = matrix.countries.length;
          const sharedCount = group.dates.filter(
            (d) => holidayMaps.filter((m) => m.has(d)).length >= 2
          ).length;
          return (
            <tbody key={group.month} id={`compare-month-${group.month}`}>
              <tr>
                <th
                  colSpan={matrix.countries.length + 1}
                  scope="colgroup"
                  className="border-b border-[var(--border)] bg-[var(--card)] px-3 py-2 text-start"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {months[group.month]}
                    {sharedCount > 0 && (
                      <span className="inline-flex items-center rounded-full bg-[var(--highlight)] px-2 py-0.5 text-xs text-[var(--fg)]">
                        {t("commonThisMonth", { count: sharedCount })}
                      </span>
                    )}
                  </span>
                </th>
              </tr>
              {group.dates.map((date) => {
                const count = holidayMaps.filter((m) => m.has(date)).length;
                const level = count === total ? 2 : count >= 2 ? 1 : 0;
                const parts = formatDateParts(date, locale);
                const rowBg =
                  level === 2
                    ? "bg-[var(--highlight-strong)]"
                    : level === 1
                      ? "bg-[var(--highlight)]"
                      : "";
                const dateCellCls =
                  `sticky start-0 z-10 ${cellBase} bg-[var(--bg)]` +
                  (level === 2
                    ? " border-s-2 border-[var(--brand)]"
                    : level === 1
                      ? " border-s-2 border-[var(--brand)]/50"
                      : "");
                return (
                  <tr key={date}>
                    <th scope="row" className={`${dateCellCls} text-start`}>
                      <span className="block font-semibold">{parts.monthDay}</span>
                      <span className="block text-xs text-[var(--muted)]">{parts.weekday}</span>
                      {level === 2 && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-fg">
                          <Check size={10} aria-hidden />
                          {t("legendAll")}
                        </span>
                      )}
                      {level === 1 && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--muted)]">
                          <Users size={10} aria-hidden />
                          {t("legendSome")}
                        </span>
                      )}
                    </th>
                    {matrix.countries.map((country, i) => {
                      const holiday = holidayMaps[i].get(date);
                      return (
                        <td
                          key={country.code}
                          className={`${cellBase} ${rowBg}`}
                          aria-label={
                            holiday
                              ? t("ariaHolidayCell", {
                                  date,
                                  holiday: holiday.name,
                                  country: country.name,
                                })
                              : t("noHoliday")
                          }
                        >
                          {holiday ? (
                            <span
                              className="block max-w-[10rem] truncate"
                              title={holiday.name}
                            >
                              {holiday.localName || holiday.name}
                            </span>
                          ) : (
                            <span aria-hidden className="text-[var(--muted)]">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {sharedCount === 0 && (
                <tr>
                  <td
                    colSpan={matrix.countries.length + 1}
                    className="px-3 py-2 text-sm text-[var(--muted)]"
                  >
                    {t("monthlyNoShared")}
                  </td>
                </tr>
              )}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}