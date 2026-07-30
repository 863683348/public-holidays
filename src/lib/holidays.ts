import type { Holiday } from "./types";
import { promises as fs } from "fs";
import path from "path";

const BASE = "https://date.nager.at/api/v3";
const CACHE_TTL = 60 * 60 * 24 * 90; // 90 days

// Local filesystem cache (used for local dev / self-hosted Node runtimes).
// On serverless platforms (Vercel) the filesystem is ephemeral, so writes are
// best-effort; the real cache is Next.js' fetch `revalidate` below.
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

export async function getHolidays(
  country: string,
  year: number
): Promise<Holiday[]> {
  const key = `h:${country.toUpperCase()}:${year}`;
  const cache = await nodeFsCache();

  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached) as Holiday[];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`, {
      signal: controller.signal,
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) {
      throw new Error(`Holiday upstream error ${res.status} for ${country}/${year}`);
    }
    const data = (await res.json()) as Holiday[];
    await cache.put(key, JSON.stringify(data));
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
