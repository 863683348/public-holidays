import type { Holiday } from "./types";

const BASE = "https://date.nager.at/api/v3";
const CACHE_TTL = 60 * 60 * 24 * 90; // 90 days

// Cross-runtime KV access: in the Cloudflare Worker runtime the binding lives on
// `cloudflare:workers`. In Node (`next dev`) that module does not exist, so we
// fall back to a direct upstream fetch (no cache).
//
// NOTE: the module specifier is intentionally built from a template literal with
// a variable so esbuild cannot statically resolve it at bundle time (which would
// otherwise fail the Cloudflare build). At runtime Workers resolve it natively.
const CF_SCHEME = "cloudflare";
async function getCache(): Promise<{
  get: (k: string) => Promise<string | null>;
  put: (k: string, v: string, opts?: { expirationTtl?: number }) => Promise<void>;
} | null> {
  try {
    const mod = await import(`${CF_SCHEME}:workers`);
    const kv = (mod as { env?: { HOLIDAY_CACHE?: KVNamespace } }).env
      ?.HOLIDAY_CACHE;
    if (!kv) return null;
    return {
      get: (k: string) => kv.get(k),
      put: (k: string, v: string, opts?: { expirationTtl?: number }) =>
        kv.put(k, v, opts),
    };
  } catch {
    return null;
  }
}

export async function getHolidays(
  country: string,
  year: number
): Promise<Holiday[]> {
  const key = `h:${country.toUpperCase()}:${year}`;
  const cache = await getCache();

  if (cache) {
    const cached = await cache.get(key);
    if (cached) return JSON.parse(cached) as Holiday[];
  }

  const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`, {
    // Edge cache hint; KV is the real cache.
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) {
    throw new Error(`Holiday upstream error ${res.status} for ${country}/${year}`);
  }
  const data = (await res.json()) as Holiday[];

  if (cache) {
    await cache.put(key, JSON.stringify(data), { expirationTtl: CACHE_TTL });
  }
  return data;
}
