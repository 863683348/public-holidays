// Fetch holiday data from Nager.Date ONCE at build time and bundle it locally,
// so the running site (Cloudflare Workers) never calls the external API at
// request time. This removes the outbound fetch that was blowing the Free
// Workers CPU budget (Cloudflare Error 1102) and making every page slow.
//
// Output: src/lib/data/holidays/<CODE>.json  ->  { [year:number]: Holiday[] }
//
// Usage:
//   node scripts/fetch-holidays.mjs                 # full window (2015..2035)
//   node scripts/fetch-holidays.mjs --years 2026    # single year (probe)
//   node scripts/fetch-holidays.mjs --years 2020-2030 --concurrency 8
//
// Env:
//   NAGER_BASE   default https://date.nager.at/api/v3
//   OUT_DIR      default src/lib/data/holidays
//   START_YEAR / END_YEAR  (only used when no --years given)

import { mkdir, writeFile, rm } from "node:fs/promises";
import { readdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const NAGER_BASE = process.env.NAGER_BASE || "https://date.nager.at/api/v3";
const OUT_DIR = process.env.OUT_DIR || path.join(ROOT, "src", "lib", "data", "holidays");

const DEFAULT_START = Number(process.env.START_YEAR || 2021);
const DEFAULT_END = Number(process.env.END_YEAR || 2035);

// ---- parse --years ----
function parseYears(arg) {
  if (!arg) return range(DEFAULT_START, DEFAULT_END);
  if (arg.includes("-")) {
    const [a, b] = arg.split("-").map(Number);
    return range(a, b);
  }
  const y = Number(arg);
  return [y];
}
function range(a, b) {
  const out = [];
  for (let y = a; y <= b; y++) out.push(y);
  return out;
}

const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const YEARS = parseYears(getArg("--years"));
const CONCURRENCY = Number(getArg("--concurrency") || 6);
const PROBE = args.includes("--probe");

// Pull the REAL country list from countries.ts (151 curated entries), NOT the
// full ~204 Nager returns — the site only supports what's in the catalogue.
function extractCountryCodes() {
  const tsPath = path.join(ROOT, "src", "lib", "countries.ts");
  const s = readFileSync(tsPath, "utf8");
  const re = /code:\s*"([A-Z]{2})"/g;
  const set = new Set();
  let m;
  while ((m = re.exec(s))) set.add(m[1]);
  return [...set].sort();
}

// ---- helpers ----
async function getJson(url, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.status === 204) return []; // Nager signals "no data"
      if (res.status === 429) {
        const wait = 1500 * attempt;
        if (PROBE) console.log(`  429 on ${url} -> wait ${wait}ms`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) {
        if (attempt < tries) continue;
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt < tries) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
        continue;
      }
      throw e;
    }
  }
  return [];
}

async function pool(items, worker, concurrency) {
  const queue = [...items];
  let done = 0;
  const total = items.length;
  const runners = Array.from({ length: Math.min(concurrency, total) }, async () => {
    while (queue.length) {
      const item = queue.pop();
      await worker(item);
      done++;
      if (!PROBE && done % 25 === 0) console.log(`  progress ${done}/${total}`);
    }
  });
  await Promise.all(runners);
}

async function main() {
  console.log(`Nager base: ${NAGER_BASE}`);
  console.log(`Years: ${YEARS[0]}..${YEARS[YEARS.length - 1]} (${YEARS.length})`);
  console.log(`Out dir: ${OUT_DIR}`);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const allCodes = extractCountryCodes();
  console.log(`Countries from countries.ts: ${allCodes.length}`);
  const countries = allCodes.map((c) => ({ countryCode: c }));
  if (PROBE) {
    // Only probe a handful to gauge rate limits.
    const sample = allCodes.slice(0, 12).map((c) => ({ countryCode: c }));
    let ok = 0,
      fail = 0;
    const t0 = Date.now();
    await pool(sample, async (c) => {
      try {
        const d = await getJson(`${NAGER_BASE}/PublicHolidays/2026/${c.countryCode}`);
        if (Array.isArray(d)) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }, 6);
    console.log(`PROBE done in ${Date.now() - t0}ms | ok=${ok} fail=${fail}`);
    return;
  }

  let totalFiles = 0;
  let totalRecords = 0;
  let emptyCountries = 0;

  await pool(countries, async (c) => {
    const code = c.countryCode.toUpperCase();
    const byYear = {};
    let any = false;
    for (const y of YEARS) {
      try {
        const data = await getJson(`${NAGER_BASE}/PublicHolidays/${y}/${code}`);
        if (Array.isArray(data)) {
          byYear[y] = data;
          totalRecords += data.length;
          if (data.length) any = true;
        }
      } catch (e) {
        console.error(`  ! ${code}/${y}: ${e.message}`);
      }
    }
    if (!any) {
      emptyCountries++;
      // still write an empty map so the file exists (cheap, avoids dynamic-import miss)
      byYear.__empty = true;
    }
    await writeFile(path.join(OUT_DIR, `${code}.json`), JSON.stringify(byYear));
    totalFiles++;
  }, CONCURRENCY);

  console.log(
    `DONE: ${totalFiles} country files, ${totalRecords} holiday records, ${emptyCountries} empty.`
  );
  // Defensive: recount files actually on disk (catches safe-delete / race issues).
  const onDisk = readdirSync(OUT_DIR).filter((f) => f.endsWith(".json")).length;
  console.log(`ON_DISK_FILES: ${onDisk}`);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
