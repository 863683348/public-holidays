import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry, getHolidayPageTitle, getHolidayPageDescription } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import CountryHolidayView from "@/components/CountryHolidayView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// Keep the year window in sync with YearNav (MIN_YEAR 2000 / MAX_YEAR 2035).
const MIN_YEAR = 2000;
const MAX_YEAR = 2035;

function parseYear(raw: string): number | null {
  const y = Number(raw);
  if (!Number.isInteger(y) || y < MIN_YEAR || y > MAX_YEAR) return null;
  return y;
}

// ISR: rendered on demand and cached for 24h. On-demand + `revalidate`
// avoids DYNAMIC_SERVER_USAGE during static generation.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; year: string }>;
}): Promise<Metadata> {
  const { locale, country, year } = await params;
  const meta = getCountry(country);
  const y = parseYear(year);
  if (!meta || y === null) return {};
  const title = getHolidayPageTitle(country, locale, y);
  const description = getHolidayPageDescription(country, locale, y);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${country}/${y}`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${country}/${y}`,
      languages: { ...languages, "x-default": `${SITE_URL}/en/${country}/${y}` },
    },
  };
}

export default async function CountryYearPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; year: string }>;
}) {
  const { locale, country, year } = await params;
  const y = parseYear(year);
  if (y === null) notFound();
  return <CountryHolidayView locale={locale} country={country} year={y} isYearPage={true} />;
}
