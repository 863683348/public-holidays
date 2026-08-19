"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import { formatDateParts, type CompareViewMode } from "./shareUrl";
import CompareLegend from "./CompareLegend";
import CompareDensityStrip from "./CompareDensityStrip";
import CompareMatrix from "./CompareMatrix";
import CompareSummary from "./CompareSummary";
import NearMiss from "./NearMiss";

/**
 * View orchestrator for the compare body. Holds the summary/matrix view
 * preference (mobile defaults to summary, desktop to matrix) and syncs it to
 * `?view=` via history.replaceState so it survives copy-paste of the URL.
 * The matrix data itself stays server-rendered — only this preference is
 * client-owned.
 */
export default function CompareView({
  matrix,
  initialView,
}: {
  matrix: CompareMatrixData;
  initialView: CompareViewMode;
}) {
  const t = useTranslations("compare");
  const tCal = useTranslations("calendar");
  const locale = useLocale();
  const [view, setView] = useState<CompareViewMode>(initialView);

  const months = tCal.raw("months") as string[];

  // Months with at least one holiday across the selection (density strip).
  const activeMonths = Array(12).fill(false) as boolean[];
  for (const country of matrix.countries) {
    for (const holiday of country.holidays) {
      const monthIndex = Number(holiday.date.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex < 12) activeMonths[monthIndex] = true;
    }
  }

  const setViewMode = (next: Exclude<CompareViewMode, "auto">) => {
    const resolved: CompareViewMode = view === next ? "auto" : next;
    setView(resolved);
    const url = new URL(window.location.href);
    if (resolved === "auto") url.searchParams.delete("view");
    else url.searchParams.set("view", resolved);
    window.history.replaceState(null, "", url.toString());
  };

  // auto: CSS default (summary on mobile, matrix on desktop). Pinned views
  // override both breakpoints.
  const summaryPanel =
    view === "matrix" ? "hidden" : view === "summary" ? "block" : "md:hidden";
  const matrixPanel =
    view === "summary"
      ? "hidden"
      : view === "matrix"
        ? "block"
        : "hidden md:block";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CompareLegend />
        <ViewToggle view={view} onChange={setViewMode} />
      </div>

      {matrix.allOff.length > 0 ? (
        <AllOffBlock matrix={matrix} />
      ) : (
        <NearMiss matrix={matrix} />
      )}

      <div className={summaryPanel}>
        <CompareSummary matrix={matrix} />
      </div>

      <div className={matrixPanel}>
        <CompareDensityStrip active={activeMonths} months={months} />
        <div className="mt-4">
          <CompareMatrix matrix={matrix} />
        </div>
      </div>
    </section>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: CompareViewMode;
  onChange: (v: Exclude<CompareViewMode, "auto">) => void;
}) {
  const t = useTranslations("compare");
  const opts: { value: Exclude<CompareViewMode, "auto">; label: string }[] = [
    { value: "summary", label: t("viewSummary") },
    { value: "matrix", label: t("viewMatrix") },
  ];
  return (
    <div
      role="group"
      aria-label={t("viewSummary")}
      className="inline-flex rounded-md border border-[var(--border)] p-0.5"
    >
      {opts.map((opt) => {
        const isActive = view === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={`min-h-[32px] rounded px-3 text-sm transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
              isActive
                ? "bg-brand text-brand-fg"
                : "text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Hero list of dates when EVERY selected country is off (value #2). */
function AllOffBlock({ matrix }: { matrix: CompareMatrixData }) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const { allOff, countries } = matrix;

  return (
    <section
      aria-labelledby="compare-all-off-heading"
      className="rounded-lg border border-[var(--brand)]/50 bg-[var(--highlight-strong)] p-4"
    >
      <h2
        id="compare-all-off-heading"
        className="flex items-center gap-2 text-base font-semibold"
      >
        <Check size={18} aria-hidden className="shrink-0 text-brand" />
        {t("allOffHeading")}
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("sharedAll", { count: countries.length })}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {allOff.map((date) => {
          const parts = formatDateParts(date, locale);
          const names = countries
            .map((c) => {
              const holiday = c.holidays.find((h) => h.date === date);
              return holiday ? holiday.localName || holiday.name : "";
            })
            .filter(Boolean);
          return (
            <li
              key={date}
              className="rounded-md border border-[var(--brand)]/30 bg-[var(--bg)]/70 px-3 py-2 text-sm"
              title={names.join(" · ")}
            >
              <span className="font-semibold">{parts.monthDay}</span>{" "}
              <span className="text-[var(--muted)]">{parts.weekday}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
