import type { Holiday } from "./types";

const BASE = "https://date.nager.at/api/v3";

// ---------------------------------------------------------------------------
// OFFLINE-FIRST data access.
//
// Holiday data is pre-fetched at BUILD TIME by `scripts/fetch-holidays.mjs`
// into `src/lib/data/holidays/<CODE>.json` (shape: { [year]: Holiday[] }).
//
// At runtime the Worker reads the bundled JSON directly — ZERO outbound
// network. This is what previously caused Cloudflare **Error 1102** on the
// Free Workers plan: every server render (incl. the homepage, which fetches
// several countries x 2 years per view) did a live `fetch()` to nager.at, and
// with the "dummy" incremental cache (always MISS) + no edge Cache Rule, every
// request paid a Worker invocation + external wait that blew the CPU budget.
//
// The live fetch below is now ONLY a fallback for years/countries that were
// not bundled (e.g. very old years), and it can never throw — it degrades to
// an empty list so the caller renders an honest, indexable empty state.
// ---------------------------------------------------------------------------

async function readBundled(
  country: string,
  year: number
): Promise<Holiday[] | null> {
  const code = country.toUpperCase();
  try {
    const mod = await import(`./data/holidays/${code}.json`);
    const byYear = ((mod as { default?: Record<string, unknown> }).default ??
      mod) as Record<string, Holiday[] | undefined>;
    // `__empty` marker = Nager has no data for this country at all.
    if (!byYear || "__empty" in byYear) return null;
    const hit = byYear[String(year)];
    if (Array.isArray(hit)) return hit;
    return null; // year not bundled -> fall back to live
  } catch {
    // No bundle file for this country (dynamic-import miss) -> live fallback.
    return null;
  }
}

async function liveFetch(country: string, year: number): Promise<Holiday[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`, {
      signal: controller.signal,
    });
    // 404 / 5xx / upstream down -> honest empty list, never throw.
    if (!res.ok) return [];
    // Nager signals "no data" with 204 No Content.
    if (res.status === 204) return [];
    return (await res.json()) as Holiday[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getHolidays(
  country: string,
  year: number
): Promise<Holiday[]> {
  const bundled = await readBundled(country, year);
  if (bundled) return bundled;
  return liveFetch(country, year);
}
