import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { COUNTRIES, getCountry, getCountryName } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { findLongWeekends } from "@/lib/longWeekend";
import { getPostsByCountry } from "@/lib/blog-posts";
import { holidayItemList, breadcrumb, faqPage } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import YearCalendar from "@/components/YearCalendar";
import LongWeekendList from "@/components/LongWeekendList";
import SubscribeButton from "@/components/SubscribeButton";
import AdSlot from "@/components/AdSlot";
import YearNav from "@/components/YearNav";
import { Link } from "@/i18n/navigation";

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
  const title = `${meta.name} Public Holidays ${year}`;
  const description = locale === "zh" ? `${meta.name}${year}年公共假期完整列表，含桥梁日和长周末规划。` : `Full list of ${year} public holidays in ${meta.name}, including bridge days and long weekends. Subscribe to your calendar.`;
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
  const meta = getCountry(country);
  if (!meta) notFound();

  const year = new Date().getFullYear();
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

  // Compute FAQ data from holidays
  const nationalCount = holidays.filter((h) => h.global).length;
  const regionalCount = holidays.length - nationalCount;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
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
          __html: JSON.stringify(holidayItemList(meta.name, year, holidays, locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumb([
              { name: locale === "zh" ? "首页" : "Home", url: `${SITE_URL}/${locale}` },
              { name: locale === "zh" ? `${meta.name}假期` : `${meta.name} Holidays`, url: `${SITE_URL}/${locale}/${country}` },
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
          <p className="text-[var(--muted)]">{locale === "zh" ? getCountryName(country, locale) : meta.name}</p>
        </div>
        <SubscribeButton country={country} label={t("subscribe")} hint={t("subscribeHint")} />
      </div>

      <YearNav country={country} year={year} />

      {/* Country Intro — dynamic summary from holiday data */}
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

      {/* Holiday types breakdown — adds rich text for SEO */}
      {(() => {
        const typeCount: Record<string, number> = {};
        holidays.forEach((h) => h.types.forEach((t) => { typeCount[t] = (typeCount[t] || 0) + 1; }));
        const typeEntries = Object.entries(typeCount);
        if (typeEntries.length === 0) return null;
        return (
          <section className="space-y-2">
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              {meta.name} celebrates {holidays.length} public holidays in {year}. These include{" "}
              {typeEntries.map(([t, c], i) => (
                <React.Fragment key={t}>
                  {i > 0 ? (i === typeEntries.length - 1 ? " and " : ", ") : ""}{c} {t.toLowerCase()}{c > 1 ? " holidays" : " holiday"}
                </React.Fragment>
              ))}.
            </p>
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              Notable national holidays include:{" "}
              {holidays.filter((h) => h.global).slice(0, 5).map((h, i, arr) => (
                <React.Fragment key={h.date}>
                  {i > 0 ? (i === arr.length - 1 ? " and " : ", ") : ""}<strong>{h.localName}{h.localName !== h.name ? " (" + h.name + ")" : ""}</strong> (on {new Date(h.date).toLocaleDateString(locale, { month: "long", day: "numeric" })})
                </React.Fragment>
              ))}.
            </p>
          </section>
        );
      })()}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("holidays")}</h2>
        <YearCalendar holidays={holidays} year={year} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("longWeekends")}</h2>
        <LongWeekendList items={longWeekends} />
      </section>

      {/* FAQ — dynamically generated from holiday data + FAQPage structured data */}
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

      {/* Related Blog Posts — internal links to blog content */}
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

      <AdSlot />
    </div>
  );
}
