import { Link } from "@/i18n/navigation";

export interface AdjacentYearLink {
  href: string;
  label: string;
}

/**
 * Verified "same holiday in {year±1}" links (SPEC-002 §3a). Renders nothing
 * until at least one adjacent year is verified — unverified years are omitted
 * silently by the parent, never shown as broken links.
 */
export default function HolidayAdjacentYears({
  heading,
  prev,
  next,
}: {
  heading: string;
  prev?: AdjacentYearLink | null;
  next?: AdjacentYearLink | null;
}) {
  if (!prev && !next) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <nav
        aria-label={heading}
        className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
      >
        {prev && (
          <Link
            href={prev.href}
            className="text-brand hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
          >
            ← {prev.label}
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="text-brand hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
          >
            {next.label} →
          </Link>
        )}
      </nav>
    </section>
  );
}
