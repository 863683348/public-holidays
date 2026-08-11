import React from "react";
import { notFound } from "next/navigation";
import {
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { CalendarDays } from "lucide-react";
import {
  COUNTRIES,
  getCountry,
  getCountryName,
  getHolidayPageTitle,
  getHolidayPageDescription,
  getDemonym,
  getOfficialSource,
} from "@/lib/countries";
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
import FaqAccordion from "@/components/FaqAccordion";
import { Link } from "@/i18n/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

/**
 * Shared holiday-page renderer for both the country landing page
 * (`/[locale]/[country]`) and the country×year pages
 * (`/[locale]/[country]/[year]`).
 *
 * `isYearPage` toggles:
 *  - 3-level breadcrumb (Home › Country › Year) + a visible "back to overview" link
 *  - canonical that includes the year segment
 *  - the "official source / last updated" E-E-A-T block + WebPage structured data
 */
export default async function CountryHolidayView({
  locale,
  country,
  year,
  isYearPage,
}: {
  locale: string;
  country: string;
  year: number;
  isYearPage: boolean;
}) {
  setRequestLocale(locale);
  const meta = getCountry(country);
  if (!meta) notFound();

  const t = await getTranslations("country");
  const th = await getTranslations("home");

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
  const daysUntil = nextHoliday
    ? Math.ceil((new Date(nextHoliday.date).getTime() - now.getTime()) / 86400000)
    : 0;
  const allNational = nationalCount === holidays.length;

  // "Is today a public holiday?" — targets next-today queries.
  const todayHoliday = holidays.find((h) => h.date === todayStr) || null;
  const faqToday = todayHoliday
    ? {
        question: t("faqToday", { name: meta.name }),
        answer: t("faqTodayYes", {
          name: meta.name,
          holiday: todayHoliday.name || todayHoliday.localName,
          date: new Date(todayHoliday.date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }),
      }
    : {
        question: t("faqToday", { name: meta.name }),
        answer: t("faqTodayNo", {
          name: meta.name,
          holiday: nextHoliday?.name || nextHoliday?.localName || "",
          date: nextHoliday
            ? new Date(nextHoliday.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "",
        }),
      };

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
          // PAA hook (SPEC-002 §4b): "When is the next public holiday…?" —
          // answered with the already-computed nextHoliday; no new fetch.
          {
            question: t("faqWhenNext", { country: meta.name }),
            answer: t("faqWhenNextAnswer", {
              country: meta.name,
              holiday: nextHoliday.name || nextHoliday.localName,
              date: new Date(nextHoliday.date + "T00:00:00Z").toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
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
    faqToday,
  ];

  // ---- SEO / E-E-A-T building blocks ----
  const title = getHolidayPageTitle(country, locale, year);
  const description = getHolidayPageDescription(country, locale, year);
  const canonical = isYearPage
    ? `${SITE_URL}/${locale}/${country}/${year}`
    : `${SITE_URL}/${locale}/${country}`;

  const crumbs = [
    { name: locale === "zh" ? "首页" : "Home", url: `${SITE_URL}/${locale}` },
    {
      name: locale === "zh" ? `${meta.name}假期` : `${meta.name} Holidays`,
      url: `${SITE_URL}/${locale}/${country}`,
    },
  ];
  if (isYearPage) {
    crumbs.push({ name: String(year), url: canonical });
  }

  const officialSource = getOfficialSource(country);
  const nowStr = now.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Structured data: holiday ItemList (Events) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(holidayItemList(meta.name, year, holidays, locale)),
        }}
      />
      {/* BreadcrumbList (2 or 3 levels) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb(crumbs)),
        }}
      />
      {/* FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPage(faqItems)),
        }}
      />
      {/* WebPage — E-E-A-T: dateModified + author/publisher Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": canonical,
            url: canonical,
            name: title,
            description: description,
            inLanguage: locale,
            dateModified: now.toISOString(),
            author: { "@type": "Organization", name: "PubHoliday", url: SITE_URL },
            publisher: {
              "@type": "Organization",
              name: "PubHoliday",
              url: SITE_URL,
            },
            isPartOf: {
              "@type": "WebSite",
              name: "PubHoliday",
              url: SITE_URL,
            },
            mainEntity: {
              "@type": "ItemList",
              name: locale === "zh" ? `${meta.name} ${year}年公共假期` : `${meta.name} ${year} public holidays`,
            },
          }),
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {isYearPage && (
            <Link href={`/${country}`} className="text-sm text-brand">
              {locale === "zh" ? `← ${meta.name}全部年份` : `← ${meta.name} all years`}
            </Link>
          )}
          <Link href="/" className="text-sm text-brand block">
            {t("backHome")}
          </Link>
          <h1 className="text-2xl font-bold">{t("yearView", { year })}</h1>
          <p className="text-[var(--muted)]">
            {locale === "zh" ? getCountryName(country, locale) : `${meta.name} (${country})`}
          </p>
        </div>
        <SubscribeButton country={country} label={t("subscribe")} hint={t("subscribeHint")} />
      </div>

      <YearNav country={country} year={year} />

      {/* Next holiday highlight */}
      {nextHoliday && (
        <section className="rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4 flex items-center gap-4">
          <CalendarDays size={32} strokeWidth={1.5} className="shrink-0 text-[var(--brand)]" aria-hidden />
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{th("nextHoliday")}</p>
            <p className="font-semibold text-lg leading-tight">
              {nextHoliday.name || nextHoliday.localName}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {new Date(nextHoliday.date).toLocaleDateString(locale, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {daysUntil} {th("days")}
            </p>
          </div>
        </section>
      )}

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
        {locale === "en" && (
          <p className="text-[var(--muted)] leading-relaxed text-sm">
            {t("bankHolidayNote", { name: meta.name, demonym: getDemonym(country), year })}
          </p>
        )}
        {locale === "ar" && (
          <p className="text-[var(--muted)] leading-relaxed text-sm">
            {t("schoolHolidayNote", { name: getCountryName(country, "ar"), year })}
          </p>
        )}
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

      {/* E-E-A-T: official source + last updated */}
      {isYearPage && (
        <section className="rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4 text-sm space-y-1">
          <p className="text-[var(--muted)] leading-relaxed">
            {locale === "zh"
              ? `数据说明：本页 ${meta.name} ${year} 年公共假期列表依据公开官方来源整理，最后更新于 ${nowStr}。`
              : `About these dates: the ${meta.name} ${year} public holiday list is compiled from public official sources and was last updated on ${nowStr}.`}
          </p>
          {officialSource && (
            <p className="leading-relaxed">
              <span className="text-[var(--muted)]">
                {locale === "zh" ? "官方来源：" : "Official source: "}
              </span>
              <a
                href={officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline break-all"
              >
                {officialSource}
              </a>
            </p>
          )}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("holidays")}</h2>
        <YearCalendar
          holidays={holidays.map((h) => ({ date: h.date, name: h.name }))}
          year={year}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("longWeekends")}</h2>
        {locale === "en" && (
          <p className="text-[var(--muted)] leading-relaxed text-sm">
            {t("holidayWeekendNote", { name: meta.name, year })}
          </p>
        )}
        <LongWeekendList items={longWeekends} />
      </section>

      {/* FAQ — dynamically generated from holiday data + FAQPage structured data */}
      {faqItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t("faqHeading")}</h2>
          <FaqAccordion items={faqItems} headingLevel="h2" />
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
