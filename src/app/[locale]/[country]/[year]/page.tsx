import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTRIES, getCountry, getHolidayPageTitle, getHolidayPageDescription, NO_DATA_COUNTRIES } from "@/lib/countries";
import { parseYear } from "@/lib/year-window";
import { routing } from "@/i18n/routing";
import CountryHolidayView from "@/components/CountryHolidayView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// Pre-render the current year + next year for every country/locale at build
// time (these cover ~all organic search traffic); other years stay on-demand.
// On-demand ISR is not honored for dynamic-segment routes on Vercel, so
// pre-rendering is what lets the CDN serve these pages.
export const revalidate = 86400;

export function generateStaticParams() {
  const thisYear = new Date().getFullYear();
  const years = [String(thisYear), String(thisYear + 1)];
  return routing.locales.flatMap((locale) =>
    COUNTRIES.flatMap((c) => years.map((year) => ({ locale, country: c.code, year })))
  );
}

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
  // Data-less countries render an honest empty state: noindex, follow (ADR-001 Q1).
  const noData = NO_DATA_COUNTRIES.has(country.toUpperCase());
  return {
    title,
    description,
    ...(noData ? { robots: { index: false, follow: true } } : {}),
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
