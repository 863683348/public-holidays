import { MapPin } from "lucide-react";
import { regionName } from "@/lib/region-names";

/**
 * Regional partition list for a regional holiday (SPEC-002 §3c). Each
 * ISO-3166-2 code is rendered via `regionName()` — Intl.DisplayNames →
 * CLDR English short name → raw code fallback. English-only by design
 * (localizing 400+ region names across 11 locales is out of scope).
 */
export default function HolidayRegions({ counties }: { counties: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-1.5 text-sm text-[var(--muted)] sm:grid-cols-2">
      {counties.map((code) => (
        <li key={code} className="flex items-center gap-2">
          <MapPin
            size={14}
            strokeWidth={1.75}
            className="shrink-0 text-[var(--brand)]"
            aria-hidden
          />
          {regionName(code)}
        </li>
      ))}
    </ul>
  );
}
