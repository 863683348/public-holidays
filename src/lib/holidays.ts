import type { Holiday } from "./types";
import { promises as fs } from "fs";
import path from "path";

const BASE = "https://date.nager.at/api/v3";
const CACHE_TTL = 60 * 60 * 24 * 90; // 90 days

// Local filesystem cache (Node runtime only). Used as a fallback when the
// Cloudflare KV binding is unavailable (e.g. `next dev` / `next start` locally)
// and pre-seeded with data so the app works without live upstream access.
const CACHE_DIR = path.join(process.cwd(), ".cache", "holidays");

// Cache keys use ":" which is a reserved character in Windows filenames, so we
// sanitize it to "__" on disk.
function keyToFile(key: string): string {
  return path.join(CACHE_DIR, `${key.replace(/:/g, "__")}.json`);
}

async function nodeFsCache() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // ignore
  }
  return {
    get: async (k: string): Promise<string | null> => {
      try {
        return await fs.readFile(keyToFile(k), "utf8");
      } catch {
        return null;
      }
    },
    put: async (k: string, v: string): Promise<void> => {
      try {
        await fs.writeFile(keyToFile(k), v, "utf8");
      } catch {
        // ignore
      }
    },
  };
}

// Cloudflare KV access: in the Worker runtime the binding lives on
// `cloudflare:workers`. In Node (`next dev` / `next start`) that module does not
// exist, so we fall back to the local filesystem cache above.
//
// NOTE: the module specifier is intentionally built from a template literal with
// a variable so esbuild cannot statically resolve it at bundle time (which would
// otherwise fail the Cloudflare build). At runtime Workers resolve it natively.
const CF_SCHEME = "cloudflare";
async function getCloudflareCache(): Promise<{
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
  const cf = await getCloudflareCache();
  const cache = cf ?? (await nodeFsCache());

  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached) as Holiday[];

  const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`, {
    // Edge cache hint; KV is the real cache.
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) {
    throw new Error(`Holiday upstream error ${res.status} for ${country}/${year}`);
  }
  const data = (await res.json()) as Holiday[];

  await cache.put(key, JSON.stringify(data), { expirationTtl: CACHE_TTL });
  return data;
}
