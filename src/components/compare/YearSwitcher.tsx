import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MIN_YEAR, MAX_YEAR } from "@/lib/year-window";
import { comparePath } from "./shareUrl";

const base =
  "inline-flex min-h-[44px] min-w-[2.75rem] items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]";
const idle =
  "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--brand)]";
const active = "border-[var(--brand)] bg-brand text-white";

/**
 * Server component. Year chips are anchor links that navigate the server-
 * rendered compare page to the new year. No client JS is shipped — the
 * Next.js router preloads the new RSC payload on hover.
 */
export default async function YearSwitcher({
  codes,
  year,
}: {
  codes: string[];
  year: number;
}) {
  const t = await getTranslations("compare");
  const clamp = (y: number) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));
  const windowYears = Array.from(
    new Set([year - 1, year, year + 1, year + 2].map(clamp))
  );
  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label={t("yearLabel")}
    >
      <Link
        href={comparePath(codes, clamp(year - 1))}
        aria-label={t("prevYear", { year: year - 1 })}
        aria-disabled={year <= MIN_YEAR ? "true" : undefined}
        className={`${base} ${idle} ${
          year <= MIN_YEAR ? "pointer-events-none cursor-not-allowed opacity-40" : ""
        }`}
      >
        <ChevronLeft size={16} aria-hidden className="rtl:rotate-180" />
      </Link>
      {windowYears.map((y) => {
        const isActive = y === year;
        if (isActive) {
          return (
            <span
              key={y}
              aria-current="true"
              className={`${base} ${active}`}
            >
              {y}
            </span>
          );
        }
        return (
          <Link
            key={y}
            href={comparePath(codes, y)}
            className={`${base} ${idle}`}
          >
            {y}
          </Link>
        );
      })}
      <Link
        href={comparePath(codes, clamp(year + 1))}
        aria-label={t("nextYear", { year: year + 1 })}
        aria-disabled={year >= MAX_YEAR ? "true" : undefined}
        className={`${base} ${idle} ${
          year >= MAX_YEAR ? "pointer-events-none cursor-not-allowed opacity-40" : ""
        }`}
      >
        <ChevronRight size={16} aria-hidden className="rtl:rotate-180" />
      </Link>
    </nav>
  );
}