import type { Metadata } from "next";
import { getCountry, getHolidayPageTitle, getHolidayPageDescription } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import CountryHolidayView from "@/components/CountryHolidayView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// ISR: rendered on demand and cached for 24h. No `generateStaticParams` —
// the locale×country space is large, so on-demand render + `revalidate`
// avoids DYNAMIC_SERVER_USAGE during static generation at build time.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  const meta = getCountry(country);
  if (!meta) return {};
  const year = new Date().getFullYear();
  const title = getHolidayPageTitle(country, locale, year);
  const description = getHolidayPageDescription(country, locale, year);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${country}`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${country}`,
      languages: { ...languages, "x-default": `${SITE_URL}/en/${country}` },
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const year = new Date().getFullYear();
  return <CountryHolidayView locale={locale} country={country} year={year} isYearPage={false} />;
}
