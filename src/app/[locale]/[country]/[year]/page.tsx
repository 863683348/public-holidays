import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCountry } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { findLongWeekends } from "@/lib/longWeekend";
import { getPostsByCountry } from "@/lib/blog-posts";
import { holidayItemList, breadcrumb, faqPage } from "@/lib/seo";
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

  // Compute FAQ data from holiday data
  const nationalCount = holidays.filter((h) => h.global).length;
  const regionalCount = holidays.length - nationalCount;
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = holidays
    .filter((h) => h.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextHoliday = upcoming[0] || null;
  const allNational = nationalCount === holidays.length;

  const faqItems = [
    {
      question: t("faqHowMany", { name: meta.name, year }),
      answer: t("faqHowManyAnswer", { name: meta.name, count: holidays.length, year }),
    },
    ...(nextHoliday
      ? [
          {
            question: t("faqNext", { name: meta.name }),
            answer: t("faqNextAnswer", {
              holiday: nextHoliday.name || nextHoliday.localName,
              date: new Date(nextHoliday.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            }),
          },
        ]
      : []),
    {
      question: t("faqAllNational", { name: meta.name }),
      answer: t("faqAllNationalAnswer", {
        yesno: allNational ? t("faqYes") : t("faqNo"),
        national: nationalCount,
        count: holidays.length,
      }),
    },
    {
      question: t("faqLongWeekends", { name: meta.name, year }),
      answer: t("faqLongWeekendsAnswer", {
        count: longWeekends.length,
        name: meta.name,
        year,
      }),
    },
  ];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPage(faqItems)),
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

      {/* Country Intro */}
      <section className="space-y-2">
        <p className="text-[var(--muted)] leading-relaxed">
          {t("introSummary", {
            name: meta.name,
            year,
            count: holidays.length,
            national: nationalCount,
            regional: regionalCount,
          })}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("holidays")}</h2>
        <YearCalendar holidays={holidays} year={year} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("longWeekends")}</h2>
        <LongWeekendList items={longWeekends} />
      </section>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("faqHeading")}</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-[var(--border)] pb-3 last:border-0">
                <h3 className="font-medium mb-1">{item.question}</h3>
                <p className="text-[var(--muted)] text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {(() => {
        const relatedPosts = getPostsByCountry(country);
        if (relatedPosts.length === 0) return null;
        return (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{t("relatedBlogPosts")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.category}/${post.slug}`}
                  className="border border-[var(--border)] rounded-lg p-4 hover:border-brand transition-colors space-y-1"
                >
                  <div className="text-xs text-[var(--muted)]">
                    {post.category} • {post.author}
                  </div>
                  <h3 className="font-semibold leading-tight">{post.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
