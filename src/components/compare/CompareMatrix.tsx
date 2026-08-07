"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Users, Check } from "lucide-react";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import type { Holiday } from "@/lib/types";
import { formatDateParts } from "./shareUrl";

const cellBase = "px-3 py-1.5 align-top border-b border-[var(--border)]";

/**
 * Full comparison matrix: rows = dates where ≥1 selected country has a
 * holiday (date-union, UTC), columns = selected countries. Common-holiday
 * rows are highlighted (L1 = some countries, L2 = every country) and the
 * sticky date column carries the level badge — color is never the only signal.
 */
export default function CompareMatrix({
  matrix,
}: {
  matrix: CompareMatrixData;
}) {
  const t = useTranslations("compare");
  const tCal = useTranslations("calendar");
  const months = tCal.raw("months") as string[];

  const holidayMaps = useMemo(
    () =>
      matrix.countries.map((c) => {
        const map = new Map<string, Holiday>();
        for (const h of c.holidays) map.set(h.date, h);
        return map;
      }),
    [matrix.countries]
  );

  const sortedDates = useMemo(() => {
    const set = new Set<string>();
    for (const c of matrix.countries) for (const h of c.holidays) set.add(h.date);
    return [...set].sort();
  }, [matrix.countries]);

  const monthGroups = useMemo(() => {
    const groups: { month: number; dates: string[] }[] = [];
    for (const date of sortedDates) {
      const m = Number(date.slice(5, 7)) - 1;
      const last = groups[groups.length - 1];
      if (!last || last.month !== m) groups.push({ month: m, dates: [date] });
      else last.dates.push(date);
    }
    return groups;
  }, [sortedDates]);

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
        {monthGroups.map((group) => (
          <MonthSection
            key={group.month}
            id={`compare-month-${group.month}`}
            monthName={months[group.month]}
            dates={group.dates}
            countries={matrix.countries}
            holidayMaps={holidayMaps}
          />
        ))}
      </table>
    </div>
  );
}

function MonthSection({
  id,
  monthName,
  dates,
  countries,
  holidayMaps,
}: {
  id: string;
  monthName: string;
  dates: string[];
  countries: CompareMatrixData["countries"];
  holidayMaps: Map<string, Holiday>[];
}) {
  const t = useTranslations("compare");
  const total = countries.length;
  const sharedCount = dates.filter(
    (d) => holidayMaps.filter((m) => m.has(d)).length >= 2
  ).length;

  return (
    <tbody id={id}>
      <tr>
        <th
          colSpan={countries.length + 1}
          scope="colgroup"
          className="border-b border-[var(--border)] bg-[var(--card)] px-3 py-2 text-start"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            {monthName}
            {sharedCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-[var(--highlight)] px-2 py-0.5 text-xs text-[var(--fg)]">
                {t("commonThisMonth", { count: sharedCount })}
              </span>
            )}
          </span>
        </th>
      </tr>
      {dates.map((date) => (
        <DateRow
          key={date}
          date={date}
          countries={countries}
          holidayMaps={holidayMaps}
          total={total}
        />
      ))}
      {sharedCount === 0 && (
        <tr>
          <td
            colSpan={countries.length + 1}
            className="px-3 py-2 text-sm text-[var(--muted)]"
          >
            {t("monthlyNoShared")}
          </td>
        </tr>
      )}
    </tbody>
  );
}

function DateRow({
  date,
  countries,
  holidayMaps,
  total,
}: {
  date: string;
  countries: CompareMatrixData["countries"];
  holidayMaps: Map<string, Holiday>[];
  total: number;
}) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const count = holidayMaps.filter((m) => m.has(date)).length;
  const level = count === total ? 2 : count >= 2 ? 1 : 0;
  const parts = formatDateParts(date, locale);
  const rowBg =
    level === 2
      ? "bg-[var(--highlight-strong)]"
      : level === 1
        ? "bg-[var(--highlight)]"
        : "";
  // Sticky date cell needs an opaque backdrop (no bleed while scrolling).
  const dateCellCls =
    `sticky start-0 z-10 ${cellBase} bg-[var(--bg)]` +
    (level === 2
      ? " border-s-2 border-[var(--brand)]"
      : level === 1
        ? " border-s-2 border-[var(--brand)]/50"
        : "");

  return (
    <tr>
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
      {countries.map((country, i) => {
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
}
