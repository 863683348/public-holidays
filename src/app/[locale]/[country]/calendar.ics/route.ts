import { getCountry } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { toICS } from "@/lib/ics";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  if (!getCountry(country)) {
    return new Response("Unknown country", { status: 404 });
  }

  const year = new Date().getFullYear();
  let holidays;
  try {
    holidays = await getHolidays(country, year);
  } catch {
    return new Response("Failed to load holidays", { status: 502 });
  }

  const ics = toICS(holidays, country.toUpperCase());
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${country.toUpperCase()}-${year}.ics"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
