import type { Holiday, HolidayGroup } from "./types";

// Pure string/grouping logic — no network, no cache. See ADR-001 §3.2/§3.3.

/**
 * Derive a stable, URL-safe slug from a holiday's English `name`.
 * The slug is always computed from the English name (never `localName`) so a
 * single slug maps 1:1 across all locales and hreflang stays valid.
 */
export function slugifyHoliday(name: string): string {
  let s = String(name ?? "");
  // Strip diacritics: "Święto" -> "Swieto", "Día" -> "Dia".
  s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  // Delete apostrophes WITHOUT inserting a separator: "New Year's" -> "new-years".
  s = s.replace(/['\u2018\u2019\u00b4`]/g, "");
  // "&" reads as a word.
  s = s.replace(/&/g, "-and-");
  s = s.toLowerCase();
  // Any run of non-alphanumerics becomes a single hyphen.
  s = s.replace(/[^a-z0-9]+/g, "-");
  s = s.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
  // Truncate to 80 chars at a hyphen boundary so we never cut mid-word.
  if (s.length > 80) {
    s = s.slice(0, 80);
    const lastDash = s.lastIndexOf("-");
    if (lastDash > 0) s = s.slice(0, lastDash);
    s = s.replace(/^-+|-+$/g, "");
  }
  return s || "holiday";
}

/**
 * Merge API records that share a slug into one HolidayGroup.
 * Returns groups sorted ascending by primaryDate, tie-broken by slug.
 */
export function groupHolidays(holidays: Holiday[]): HolidayGroup[] {
  // Preserve API order for first-seen semantics (name/localName tie-breaks).
  const buckets = new Map<string, Holiday[]>();
  for (const h of holidays) {
    const slug = slugifyHoliday(h.name);
    const bucket = buckets.get(slug);
    if (bucket) bucket.push(h);
    else buckets.set(slug, [h]);
  }

  const groups: HolidayGroup[] = [];
  for (const [slug, records] of buckets) {
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const dates = [...new Set(sorted.map((r) => r.date))].sort();

    const anyGlobal = records.some((r) => r.global);
    const anyNullCounties = records.some((r) => r.counties === null);
    // null if ANY record is global or has null counties; otherwise the sorted union.
    const counties =
      anyGlobal || anyNullCounties
        ? null
        : [...new Set(records.flatMap((r) => r.counties ?? []))].sort();

    // Order-preserving, de-duplicated union of types.
    const types: string[] = [];
    for (const r of records) {
      for (const t of r.types) if (!types.includes(t)) types.push(t);
    }

    const launchYear =
      records.map((r) => r.launchYear).find((v) => v != null) ?? null;

    groups.push({
      slug,
      name: records[0].name,
      localName: sorted[0].localName, // earliest-dated record
      dates,
      primaryDate: dates[0],
      types,
      counties,
      global: anyGlobal,
      fixed: records.every((r) => r.fixed),
      launchYear,
      records: sorted,
    });
  }

  groups.sort(
    (a, b) =>
      a.primaryDate.localeCompare(b.primaryDate) || a.slug.localeCompare(b.slug)
  );
  return groups;
}

/**
 * Look up a group by slug, normalising the input the same way as the stored
 * slugs (case-insensitive, diacritic-insensitive). Returns null when absent —
 * the caller decides between notFound() and redirect.
 */
export function findHolidayGroup(
  holidays: Holiday[],
  slug: string
): HolidayGroup | null {
  const target = slugifyHoliday(slug);
  const groups = groupHolidays(holidays);
  return groups.find((g) => g.slug === target) ?? null;
}
