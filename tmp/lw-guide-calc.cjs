// tmp/lw-guide-calc.cjs
// Reproducible long-weekend calculator for the T3-③ blog posts.
// Fetches Nager public holidays + reimplements findLongWeekends logic so the
// dates written into the articles can be regenerated at any time.
// Run: node tmp/lw-guide-calc.cjs [country...]  (default: US GB DE JP)
"use strict";

const BASE = "https://date.nager.at/api/v3/PublicHolidays";

// ---- longWeekend.ts port (pure, no deps) ----
function fmt(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}
function diffDays(a, b) {
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}
function isWeekend(d) {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}
function startOfWeekend(d) {
  return isWeekend(d) && d.getUTCDay() === 0 ? addDays(d, -1) : d;
}
function endOfWeekend(d) {
  return isWeekend(d) && d.getUTCDay() === 6 ? addDays(d, 1) : d;
}
function findLongWeekends(holidays, year) {
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));
  const rest = new Set();
  for (let t = yearStart.getTime(); t <= yearEnd.getTime(); t += 86400000) {
    const dt = new Date(t);
    if (isWeekend(dt)) rest.add(fmt(dt));
  }
  for (const h of holidays) rest.add(h.date);
  const out = [];
  let cur = new Date(yearStart);
  while (cur <= yearEnd) {
    const k = fmt(cur);
    if (rest.has(k)) {
      let end = new Date(cur);
      let nxt = addDays(end, 1);
      while (nxt <= yearEnd && rest.has(fmt(nxt))) {
        end = nxt;
        nxt = addDays(end, 1);
      }
      const days = diffDays(end, cur) + 1;
      if (days >= 3) out.push({ start: fmt(cur), end: fmt(end), days, needBridge: false });
      cur = addDays(end, 1);
    } else {
      cur = addDays(cur, 1);
    }
  }
  for (const h of holidays) {
    const hd = new Date(`${h.date}T00:00:00Z`);
    if (isWeekend(hd)) continue;
    const prev = addDays(hd, -1);
    const prev2 = addDays(hd, -2);
    if (!rest.has(fmt(prev)) && isWeekend(prev2)) {
      const start = startOfWeekend(prev2);
      out.push({
        start: fmt(start),
        end: h.date,
        days: diffDays(hd, start) + 1,
        needBridge: true,
        bridgeDay: fmt(prev),
      });
    }
    const nxt = addDays(hd, 1);
    const nxt2 = addDays(hd, 2);
    if (!rest.has(fmt(nxt)) && isWeekend(nxt2)) {
      const end = endOfWeekend(nxt2);
      out.push({
        start: h.date,
        end: fmt(end),
        days: diffDays(end, hd) + 1,
        needBridge: true,
        bridgeDay: fmt(nxt),
      });
    }
  }
  out.sort((a, b) => a.start.localeCompare(b.start));
  return out;
}

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function weekday(dateStr) {
  return WD[new Date(`${dateStr}T00:00:00Z`).getUTCDay()];
}

async function main() {
  const countries = process.argv.slice(2);
  const year = 2026;
  const holidayByName = new Map(); // country -> Map(name -> date)
  for (const code of countries) {
    const res = await fetch(`${BASE}/${year}/${code}`);
    if (!res.ok) {
      console.log(`!! ${code}: upstream ${res.status}`);
      continue;
    }
    const holidays = await res.json();
    const map = new Map();
    for (const h of holidays) {
      const key = `${h.name} (${h.localName})`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(h.date);
    }
    holidayByName.set(code, map);
    const lws = findLongWeekends(holidays, year);
    console.log(`\n===== ${code} ${year} — ${lws.length} long weekends =====`);
    for (const lw of lws) {
      console.log(
        `- ${lw.start} (${weekday(lw.start)}) -> ${lw.end} (${weekday(lw.end)}) | ${lw.days} days | bridge=${lw.needBridge ? "yes " + lw.bridgeDay : "no"}`
      );
    }
    // Holidays that actually anchor the long weekends (non-weekend holidays)
    console.log("--- non-weekend holidays ---");
    const nonWk = holidays
      .filter((h) => !isWeekend(new Date(`${h.date}T00:00:00Z`)))
      .sort((a, b) => a.date.localeCompare(b.date));
    const seen = new Set();
    for (const h of nonWk) {
      const k = `${h.date}|${h.name}`;
      if (seen.has(k)) continue;
      seen.add(k);
      console.log(`- ${h.date} (${weekday(h.date)}) ${h.name} [${h.global ? "national" : "regional"}]`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
