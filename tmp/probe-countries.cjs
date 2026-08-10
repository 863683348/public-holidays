// Probe Nager.Date for 2026 holiday data across candidate countries.
// Usage: node tmp/probe-countries.cjs
// Outputs: candidates with 2026 data (hits), and those without (204/error).
const fs = require("fs");

const API = "https://date.nager.at/api/v3";

async function main() {
  const available = await fetch(`${API}/AvailableCountries`).then((r) => r.json());
  console.log(`AvailableCountries total: ${available.length}`);

  const src = fs.readFileSync("src/lib/countries.ts", "utf8");
  const existing = new Set([...src.matchAll(/code: "([A-Z]{2})"/g)].map((m) => m[1]));
  const NO_DATA = new Set(["IN", "AE", "TH", "MY", "TW", "SA", "IL"]);

  const candidates = available.filter(
    (c) => !existing.has(c.countryCode) && !NO_DATA.has(c.countryCode)
  );
  console.log(`Candidates to probe: ${candidates.length}`);

  const results = new Map(); // code -> {name, status, count}
  const CONCURRENCY = 10;
  let idx = 0;
  async function worker() {
    while (idx < candidates.length) {
      const c = candidates[idx++];
      try {
        const res = await fetch(`${API}/PublicHolidays/2026/${c.countryCode}`, {
          headers: { Accept: "application/json" },
        });
        if (res.status === 204) {
          results.set(c.countryCode, { name: c.name, status: 204, count: 0 });
        } else if (res.ok) {
          const body = await res.json();
          results.set(c.countryCode, { name: c.name, status: 200, count: body.length });
        } else {
          results.set(c.countryCode, { name: c.name, status: res.status, count: 0 });
        }
      } catch (e) {
        results.set(c.countryCode, { name: c.name, status: "ERR", count: 0 });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const hits = [...results.entries()].filter(([, v]) => v.status === 200);
  const misses = [...results.entries()].filter(([, v]) => v.status !== 200);
  hits.sort((a, b) => b[1].count - a[1].count);

  console.log(`\n=== WITH 2026 DATA (${hits.length}) ===`);
  for (const [code, v] of hits) {
    console.log(`${code}\t${v.name}\t${v.count}`);
  }
  console.log(`\n=== NO 2026 DATA / ERROR (${misses.length}) ===`);
  for (const [code, v] of misses) {
    console.log(`${code}\t${v.name}\t${v.status}`);
  }
  fs.writeFileSync(
    "tmp/probe-result.json",
    JSON.stringify({ hits, misses }, null, 2)
  );
  console.log("\nSaved tmp/probe-result.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
