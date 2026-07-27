import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCountry } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { findLongWeekends } from "@/lib/longWeekend";
import { holidayItemList, breadcrumb } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import YearCalendar from "@/components/YearCalendar";
import LongWeekendList from "@/components/LongWeekendList";
import SubscribeButton from "@/components/SubscribeButton";
import YearNav from "@/components/YearNav";
import { Link } from "@/i18n/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// ISR: rendered on demand, cached 24h.
export const revalidate = 86400;

export function generateStaticParams() {
  const year = new Date().getFullYear();
  return [year - 1, year, year + 1, year + 2].map((y) => ({ year: String(y) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; year: string }>;
}): Promise<Metadata> {
  const { locale, country, year: yearStr } = await params;
  const meta = getCountry(country);
  if (!meta) return {};
  const year = Number(yearStr);
  if (!Number.isInteger(year) || year < 2000 || year > 2035) return {};
  const title = `${meta.name} Public Holidays ${year}`;
  const description = `Full list of ${year} public holidays in ${meta.name}, including bridge days and long weekends. Subscribe to your calendar.`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${country}/${year}`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${country}/${year}`,
      languages: { ...languages, "x-default": `${SITE_URL}/en/${country}/${year}` },
    },
  };
}

export default async function CountryYearPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; year: string }>;
}) {
  const { locale, country, year: yearStr } = await params;
  const meta = getCountry(country);
  if (!meta) notFound();

  const year = Number(yearStr);
  if (!Number.isInteger(year) || year < 2000 || year > 2035) notFound();

  const t = await getTranslations("country");

  let holidays;
  try {
    holidays = await getHolidays(country, year);
  } catch {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm text-brand">
          {t("backHome")}
        </Link>
        <p className="text-[var(--muted)]">{t("dataLag")}</p>
      </div>
    );
  }

  const longWeekends = findLongWeekends(holidays, year);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(holidayItemList(meta.name, year, holidays)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumb([
              { name: "Home", url: `${SITE_URL}/${locale}` },
              { name: meta.name, url: `${SITE_URL}/${locale}/${country}` },
              {
                name: String(year),
                url: `${SITE_URL}/${locale}/${country}/${year}`,
              },
            ])
          ),
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-brand">
            {t("backHome")}
          </Link>
          <h1 className="text-2xl font-bold">{t("yearView", { year })}</h1>
          <p className="text-[var(--muted)]">{meta.name}</p>
        </div>
        <SubscribeButton country={country} label={t("subscribe")} hint={t("subscribeHint")} />
      </div>

      <YearNav country={country} year={year} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("holidays")}</h2>
        <YearCalendar holidays={holidays} year={year} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("longWeekends")}</h2>
        <LongWeekendList items={longWeekends} />
      </section>
    </div>
  );
}
