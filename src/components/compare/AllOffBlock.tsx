import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import type { CompareMatrix as CompareMatrixData } from "@/lib/compare";
import { formatDateParts } from "./shareUrl";

/**
 * Server component. Hero block listing dates when EVERY selected country is
 * off (the "value #2" pattern). Mirrors the previous AllOffBlock that lived
 * inside CompareView; same markup, no client JS.
 */
export default async function AllOffBlock({
  matrix,
  locale,
}: {
  matrix: CompareMatrixData;
  locale: string;
}) {
  const t = await getTranslations("compare");
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