"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarX2 } from "lucide-react";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import { formatDateParts } from "./shareUrl";

const chip =
  "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-xs text-[var(--fg)]";

/**
 * Near-miss state (SPEC-002 §2d): when NO date is shared by every selected
 * country (allOff = []), surface the dates shared by the MOST countries
 * instead of rendering a bare empty grid. `max` < total by construction here —
 * CompareView only renders this when matrix.allOff is empty.
 */
export default function NearMiss({ matrix }: { matrix: CompareMatrixData }) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const { year, countries } = matrix;

  const groups = useMemo(() => {
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
    let max = 1;
    for (const count of countByDate.values()) if (count > max) max = count;
    const best: { date: string; codes: string[] }[] = [];
    for (const [date, count] of countByDate) {
      if (count === max && count >= 2) {
        best.push({ date, codes: codesByDate.get(date) ?? [] });
      }
    }
    best.sort((a, b) => a.date.localeCompare(b.date));
    return { max, best };
  }, [countries]);

  const namesByCode = useMemo(
    () => new Map(countries.map((c) => [c.code, c.name])),
    [countries]
  );

  // No two countries share a single day — nothing to salvage, show guidance.
  if (groups.best.length === 0) {
    return (
      <section
        aria-labelledby="compare-near-miss-heading"
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <h2
          id="compare-near-miss-heading"
          className="flex items-center gap-2 text-base font-semibold"
        >
          <CalendarX2 size={18} aria-hidden className="shrink-0 text-[var(--muted)]" />
          {t("emptyHeading")}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("emptyBody")}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("allOffNone", { year })}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="compare-near-miss-heading"
      className="rounded-lg border border-[var(--brand)]/30 bg-[var(--highlight)] p-4"
    >
      <h2
        id="compare-near-miss-heading"
        className="text-base font-semibold"
      >
        {t("allOffNone", { year })}
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{t("nearMissPrefix")}</p>
      <ul className="mt-3 space-y-2">
        {groups.best.map((row) => {
          const parts = formatDateParts(row.date, locale);
          return (
            <li
              key={row.date}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-[var(--bg)]/70 px-3 py-2 text-sm"
            >
              <span className="font-semibold">{parts.monthDay}</span>
              <span className="text-xs text-[var(--muted)]">{parts.weekday}</span>
              <span className="text-[var(--muted)]">
                {t("sharedCount", { count: row.codes.length })}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {row.codes.map((code) => (
                  <span key={code} className={chip}>
                    {namesByCode.get(code) ?? code}
                  </span>
                ))}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {t("countriesNotOff", {
                  count: countries.length - row.codes.length,
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
