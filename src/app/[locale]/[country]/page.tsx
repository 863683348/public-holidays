import type { Metadata } from "next";
import { COUNTRIES, getCountry, getHolidayPageTitle, getHolidayPageDescription, NO_DATA_COUNTRIES } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import CountryHolidayView from "@/components/CountryHolidayView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

// Pre-render every locale × country at build time so the CDN serves them
// directly (PRERENDER). On-demand ISR is not honored for dynamic-segment
// routes on Vercel (each request re-renders), which was inflating Fast Origin
// Transfer. 改由 /api/revalidate 按需刷新，不再用时间型 revalidate。

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COUNTRIES.map((c) => ({ locale, country: c.code }))
  );
}

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
  // Countries the upstream has no data for render an honest empty state — keep
  // them out of the index but let crawlers follow the internal links (ADR-001 Q1).
  const noData = NO_DATA_COUNTRIES.has(country.toUpperCase());
  return {
    title,
    description,
    ...(noData ? { robots: { index: false, follow: true } } : {}),
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
