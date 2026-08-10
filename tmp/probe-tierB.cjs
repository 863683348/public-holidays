// Probe Nager.Date for 2026+2027 holiday data across the exact Tier-B candidate
// list. Kept in tmp/ — not committed. Task: P1-① expand COUNTRIES 110 -> ~150.
const API = "https://date.nager.at/api/v3";

const CANDIDATES = [
  // Europe
  "AD", "MC", "LI", "SM", "VA",
  // Americas / Caribbean
  "HT", "BB", "BZ", "GY", "SR", "AG", "DM", "GD", "KN", "LC", "VC",
  // Africa
  "RW", "NA", "BW", "MG", "SC", "CV", "MW", "GM", "BJ", "TG", "ML", "BF",
  "GN", "SL", "CD", "SD", "SO", "YE", "NE", "TD",
  // Oceania
  "VU", "WS", "SB", "TO",
];

async function probe(code, year) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${API}/PublicHolidays/${year}/${code}`, {
        headers: { Accept: "application/json" },
      });
      if (res.status === 204) return { status: 204, count: 0 };
      if (res.ok) {
        const body = await res.json();
        return { status: 200, count: Array.isArray(body) ? body.length : -1 };
      }
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
        continue;
      }
      return { status: res.status, count: 0 };
    } catch (e) {
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
  return { status: "ERR", count: 0 };
}

async function main() {
  const results = [];
  for (const code of CANDIDATES) {
    const y2026 = await probe(code, 2026);
    const y2027 = await probe(code, 2027);
    const ok = y2026.status === 200 && y2026.count > 0 && y2027.status === 200 && y2027.count > 0;
    results.push({ code, y2026, y2027, ok });
    console.log(
      `${ok ? "OK " : "FAIL"} ${code}  2026:${y2026.status}/${y2026.count}  2027:${y2027.status}/${y2027.count}`
    );
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\nTotal candidates: ${results.length}, OK: ${results.length - failed.length}, FAILED: ${failed.length}`);
  if (failed.length) console.log("Failed:", failed.map((f) => `${f.code} (2026:${f.y2026.status}, 2027:${f.y2027.status})`).join(", "));
  require("fs").writeFileSync("tmp/probe-tierB-result.json", JSON.stringify(results, null, 2));
}

main();
