import { Link } from "@/i18n/navigation";
import HolidaySiblingList from "@/components/HolidaySiblingList";
import type { HolidayGroup } from "@/lib/types";

/**
 * "Other public holidays in {country} {year}" section (heading + sibling grid +
 * view-all link). Split out of HolidayDetailView to keep it ≤300 lines.
 */
export default function HolidaySiblingSection({
  heading,
  viewAll,
  groups,
  currentSlug,
  country,
  year,
  locale,
}: {
  heading: string;
  viewAll: string;
  groups: HolidayGroup[];
  currentSlug: string;
  country: string;
  year: number;
  locale: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <HolidaySiblingList
        groups={groups}
        currentSlug={currentSlug}
        country={country}
        year={year}
        locale={locale}
      />
      <Link
        href={`/${country}/${year}`}
        className="inline-block text-sm text-brand hover:underline"
      >
        {viewAll}
      </Link>
    </section>
  );
}
