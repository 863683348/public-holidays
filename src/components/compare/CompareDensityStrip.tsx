"use client";

import { useTranslations } from "next-intl";

/**
 * 12-cell micro navigation for the matrix: months with any selected-country
 * holiday are highlighted and jump to that month block; empty months are
 * disabled. Lives inside the matrix panel only (it navigates month sections).
 */
export default function CompareDensityStrip({
  active,
  months,
}: {
  active: boolean[];
  months: string[];
}) {
  const t = useTranslations("compare");
  const jump = (monthIndex: number) => {
    document
      .getElementById(`compare-month-${monthIndex}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav
      aria-label={t("densityLabel")}
      className="flex flex-wrap gap-1.5"
    >
      {months.map((month, i) => (
        <button
          key={month}
          type="button"
          disabled={!active[i]}
          onClick={() => jump(i)}
          aria-label={t("ariaMonthNav", { month })}
          className={`min-h-[32px] rounded-md border px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)] ${
            active[i]
              ? "border-[var(--brand)]/40 bg-[var(--highlight)] text-[var(--fg)] hover:bg-[var(--highlight-strong)]"
              : "cursor-not-allowed border-[var(--border)] text-[var(--muted)] opacity-50"
          }`}
        >
          {month}
        </button>
      ))}
    </nav>
  );
}
