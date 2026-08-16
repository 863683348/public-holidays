import { getTranslations } from "next-intl/server";

/**
 * Server component. 12-cell month navigator implemented as anchor links so
 * it ships zero client JS — the browser's native smooth-scroll handles the
 * jump. Months with no selected-country holiday are rendered as disabled
 * (non-anchor) spans.
 */
export default async function CompareDensityStrip({
  active,
  months,
}: {
  active: boolean[];
  months: string[];
}) {
  const t = await getTranslations("compare");
  return (
    <nav
      aria-label={t("densityLabel")}
      className="flex flex-wrap gap-1.5"
    >
      {months.map((month, i) => {
        const isActive = active[i];
        const label = t("ariaMonthNav", { month });
        if (!isActive) {
          return (
            <span
              key={month}
              aria-disabled="true"
              title={label}
              className="inline-flex min-h-[32px] cursor-not-allowed items-center rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] opacity-50"
            >
              {month}
            </span>
          );
        }
        return (
          <a
            key={month}
            href={`#compare-month-${i}`}
            aria-label={label}
            className="inline-flex min-h-[32px] items-center rounded-md border border-[var(--brand)]/40 bg-[var(--highlight)] px-2 py-1 text-xs text-[var(--fg)] transition-colors hover:bg-[var(--highlight-strong)] focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
          >
            {month}
          </a>
        );
      })}
    </nav>
  );
}