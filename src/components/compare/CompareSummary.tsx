"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import { formatDateParts } from "./shareUrl";

const chip =
  "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-xs text-[var(--fg)]";

/**
 * Mobile-first simplified view: only the high-value shared days (≥2 selected
 * countries off). No horizontal scroll — a vertical, scannable list.
 */
export default function CompareSummary({
  matrix,
}: {
  matrix: CompareMatrixData;
}) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const { year, countries } = matrix;

  const rows = useMemo(() => {
    const countByDate = new Map<string, number>();
    const codesByDate = new Map<string, string[]>();
    for (const c of countries) {
      for (const h of c.holidays) {
        countByDate.set(h.date, (countByDate.get(h.date) ?? 0) + 1);
        const codes = codesByDate.get(h.date) ?? [];
        codes.push(c.code);
        codesByDate.set(h.date, codes);
      }
    }
    const out: { date: string; codes: string[] }[] = [];
    for (const [date, count] of countByDate) {
      if (count >= 2) out.push({ date, codes: codesByDate.get(date) ?? [] });
    }
    out.sort((a, b) => a.date.localeCompare(b.date));
    return out;
  }, [countries]);

  const namesByCode = useMemo(
    () => new Map(countries.map((c) => [c.code, c.name])),
    [countries]
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
        {t("allOffNone", { year })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--muted)]">{t("summaryHint")}</p>
      <ul className="space-y-2">
        {rows.map((row) => {
          const parts = formatDateParts(row.date, locale);
          return (
            <li
              key={row.date}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-[5.5rem]">
                  <p className="text-sm font-semibold">{parts.monthDay}</p>
                  <p className="text-xs text-[var(--muted)]">{parts.weekday}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.codes.map((code) => (
                    <span key={code} className={chip}>
                      {namesByCode.get(code) ?? code}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
