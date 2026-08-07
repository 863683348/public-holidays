"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { MIN_YEAR, MAX_YEAR } from "@/lib/year-window";
import { comparePath } from "./shareUrl";

const base =
  "inline-flex min-h-[44px] min-w-[2.75rem] items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]";
const idle =
  "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--brand)]";
const active = "border-[var(--brand)] bg-brand text-white";

/**
 * Year chips in the 2000–2035 window (mirrors YearNav). Selecting a year
 * re-navigates so the server renders the matrix for that year.
 */
export default function YearSwitcher({
  codes,
  year,
}: {
  codes: string[];
  year: number;
}) {
  const t = useTranslations("compare");
  const router = useRouter();
  const clamp = (y: number) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));
  const windowYears = Array.from(
    new Set([year - 1, year, year + 1, year + 2].map(clamp))
  );
  const go = (y: number) => router.replace(comparePath(codes, y));

  return (
    <nav className="flex items-center justify-center gap-2" aria-label={t("yearLabel")}>
      <button
        type="button"
        onClick={() => go(year - 1)}
        disabled={year <= MIN_YEAR}
        aria-label={t("prevYear", { year: year - 1 })}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} aria-hidden className="rtl:rotate-180" />
      </button>
      {windowYears.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => go(y)}
          aria-current={y === year ? "true" : undefined}
          className={`${base} ${y === year ? active : idle}`}
        >
          {y}
        </button>
      ))}
      <button
        type="button"
        onClick={() => go(year + 1)}
        disabled={year >= MAX_YEAR}
        aria-label={t("nextYear", { year: year + 1 })}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={16} aria-hidden className="rtl:rotate-180" />
      </button>
    </nav>
  );
}
