const API = "https://date.nager.at/api/v3";
const CODES = ["BI","LR","SS","MR","ER","LY","LS","GA","SZ","CF","CG","SY","DJ"];
async function probe(code, year) {
  for (let a = 1; a <= 3; a++) {
    try {
      const res = await fetch(API + "/PublicHolidays/" + year + "/" + code, { headers: { Accept: "application/json" } });
      if (res.status === 204) return { status: 204, count: 0 };
      if (res.ok) { const b = await res.json(); return { status: 200, count: Array.isArray(b) ? b.length : -1 }; }
      if (res.status === 429 || res.status >= 500) { await new Promise(r => setTimeout(r, 800 * a)); continue; }
      return { status: res.status, count: 0 };
    } catch (e) { await new Promise(r => setTimeout(r, 800 * a)); }
  }
  return { status: "ERR", count: 0 };
}
(async () => {
  for (const c of CODES) {
    const y26 = await probe(c, 2026), y27 = await probe(c, 2027);
    const ok = y26.status === 200 && y26.count > 0 && y27.status === 200 && y27.count > 0;
    console.log((ok ? "OK " : "FAIL") + " " + c + "  2026:" + y26.status + "/" + y26.count + "  2027:" + y27.status + "/" + y27.count);
  }
})();
