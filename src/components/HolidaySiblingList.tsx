import { Link } from "@/i18n/navigation";
import type { HolidayGroup } from "@/lib/types";

/**
 * Compact internal-link grid to every OTHER holiday in the same country/year.
 * Server component — renders next-intl <Link> with locale-relative hrefs so the
 * active locale is prefixed automatically (mirrors YearNav.tsx). No prose.
 */
export default function HolidaySiblingList({
  groups,
  currentSlug,
  country,
  year,
  locale,
}: {
  groups: HolidayGroup[];
  currentSlug: string;
  country: string;
  year: number;
  locale: string;
}) {
  const siblings = groups.filter((g) => g.slug !== currentSlug);
  if (siblings.length === 0) return null;

  const fmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {siblings.map((g) => (
        <li key={g.slug}>
          <Link
            href={`/${country}/${year}/${g.slug}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition-colors hover:border-[var(--brand)]"
          >
            <span className="truncate font-medium">
              {g.localName && g.localName !== g.name
                ? `${g.name} (${g.localName})`
                : g.name}
            </span>
            <span className="shrink-0 text-[var(--muted)]">
              {fmt.format(new Date(g.primaryDate + "T00:00:00Z"))}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
