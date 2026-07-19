import { getCountry } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") ?? "US").toUpperCase();
  const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());

  if (!getCountry(country) || !Number.isInteger(year)) {
    return Response.json({ error: "invalid params" }, { status: 400 });
  }

  try {
    const holidays = await getHolidays(country, year);
    return Response.json({ country, year, count: holidays.length, holidays });
  } catch {
    return Response.json({ error: "upstream failed" }, { status: 502 });
  }
}
