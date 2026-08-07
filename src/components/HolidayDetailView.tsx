import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getCountry,
  getCountryName,
  getOfficialSource,
  getHolidayDetailTitle,
  getHolidayDetailDescription,
} from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { groupHolidays, slugifyHoliday, findHolidayGroup } from "@/lib/slug";
import { deriveHolidayFacts, type BridgeAdvice } from "@/lib/holiday-facts";
import { timeZoneForCountry, currencyForCountry, isoWeek, dayOfYear } from "@/lib/country-meta";
import {
  breadcrumb,
  faqPage,
  holidayEvent,
  holidayEventList,
  webPageDetail,
} from "@/lib/seo";
import { MIN_YEAR, MAX_YEAR } from "@/lib/year-window";
import type { Holiday, HolidayGroup } from "@/lib/types";
import HolidayFaq, { type FaqItem } from "@/components/HolidayFaq";
import HolidayAdjacentYears from "@/components/HolidayAdjacentYears";
import HolidayMultiDate from "@/components/HolidayMultiDate";
import HolidayRegions from "@/components/HolidayRegions";
import HolidaySource from "@/components/HolidaySource";
import HolidaySiblingSection from "@/components/HolidaySiblingSection";
import HolidayMetaRows from "@/components/HolidayMetaRows";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

const BRIDGE_KEY: Record<BridgeAdvice, string> = {
  "long-weekend": "bridgeLongWeekend",
  "take-monday": "bridgeTakeMonday",
  "take-friday": "bridgeTakeFriday",
  midweek: "bridgeMidweek",
  weekend: "bridgeWeekend",
};

function utcDate(d: string): Date {
  return new Date(d + "T00:00:00Z");
}

export default async function HolidayDetailView({
  locale,
  country,
  year,
  slug,
}: {
  locale: string;
  country: string;
  year: number;
  slug: string;
}) {
  const meta = getCountry(country);
  if (!meta) notFound();

  // Canonical country code: /en/us/… must 308 to /en/US/… (ADR-001 §3.4).
  if (country !== meta.code) permanentRedirect(`/${locale}/${meta.code}/${year}/${slug}`);

  const t = await getTranslations("holidayDetail");
  const tc = await getTranslations("country");
  const tn = await getTranslations("nav");
  const countryName = getCountryName(country, locale);

  let holidays;
  try {
    holidays = await getHolidays(country, year);
  } catch {
    return (
      <div className="space-y-4">
        <Link href={`/${country}/${year}`} className="text-sm text-brand">{t("backToYear", { country: countryName, year })}</Link>
        <p className="text-[var(--muted)]">{tc("dataLag")}</p>
      </div>
    );
  }

  const groups = groupHolidays(holidays);
  let group = groups.find((g) => g.slug === slug);
  if (!group) {
    // Non-canonical slug → 301 to the canonical URL; a truly unknown slug → 404.
    const canonical = slugifyHoliday(slug);
    const match = groups.find((g) => g.slug === canonical);
    if (match && match.slug !== slug) permanentRedirect(`/${locale}/${country}/${year}/${match.slug}`);
    if (!match) notFound();
    group = match;
  }

  const now = new Date();
  const facts = deriveHolidayFacts(group, now);

  // Locale-aware, timezone-safe formatting (all dates parsed as UTC midnight).
  const longFmt = new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const dayFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });

  const primary = utcDate(group.primaryDate);
  const weekday = weekdayFmt.format(primary);
  const dateLong = longFmt.format(primary);
  const dateShort = dayFmt.format(primary);

  const displayName =
    group.localName && group.localName !== group.name
      ? `${group.name} (${group.localName})`
      : group.name;

  // ---- Countdown line ------------------------------------------------------
  const countdown =
    facts.daysUntil === 0 ? t("countdownToday", { name: group.name })
    : facts.daysUntil === 1 ? t("countdownTomorrow", { name: group.name })
    : facts.daysUntil > 1 ? t("countdownFuture", { name: group.name, days: facts.daysUntil })
    : t("countdownPast", { name: group.name });

  // ---- Scope + type --------------------------------------------------------
  const scopeLabel =
    facts.scope === "national" ? t("scopeNational") : facts.scope === "regional" ? t("scopeRegional", { count: facts.regionCount }) : t("scopeUnknown");
  const typeLabel = [facts.isPublic ? t("typePublic") : null, ...facts.otherTypes].filter(Boolean).join(" · ");

  // ---- Micro data rows (P1-②): ISO week / day of year / local tz / currency ----
  // Time zone and currency come from the country catalogue; unknown codes are
  // honestly omitted (null → row dropped) rather than showing a placeholder.
  const localTz = timeZoneForCountry(country); const currency = currencyForCountry(country);
  const metaRows = [
    { label: t("factDate"), value: dateLong },
    { label: t("factWeekday"), value: weekday },
    { label: t("factScope"), value: scopeLabel },
    ...(typeLabel ? [{ label: t("factType"), value: typeLabel }] : []),
    { label: t("metaWeek"), value: String(isoWeek(group.primaryDate)) },
    { label: t("metaDayOfYear"), value: String(dayOfYear(group.primaryDate)) },
    ...(localTz ? [{ label: t("metaTimeZone"), value: localTz }] : []),
    ...(currency ? [{ label: t("metaCurrency"), value: currency }] : []),
  ];

  // ---- Adjacent-year verified links (SPEC §3a) -----------------------------
  // Best-effort fetch year-1/year+1 (skip out-of-window years); link to a year
  // only when its data actually contains the same slug. Upstream failure → no
  // link (and no next-occurrence FAQ), never an error.
  const prevYear = year - 1;
  const nextYear = year + 1;
  const tasks: { year: number; promise: Promise<Holiday[]> }[] = [];
  if (prevYear >= MIN_YEAR) tasks.push({ year: prevYear, promise: getHolidays(country, prevYear) });
  if (nextYear <= MAX_YEAR) tasks.push({ year: nextYear, promise: getHolidays(country, nextYear) });

  const settled = await Promise.allSettled(tasks.map((t) => t.promise));
  const attemptedYears = new Set(tasks.map((t) => t.year));
  const failedYears = new Set<number>();
  const yearGroups = new Map<number, HolidayGroup | null>();
  settled.forEach((result, i) => {
    const { year: y } = tasks[i];
    if (result.status === "fulfilled") yearGroups.set(y, findHolidayGroup(result.value, group.slug));
    else failedYears.add(y);
  });

  const prevGroup = yearGroups.get(prevYear);
  const nextGroup = yearGroups.get(nextYear);
  const prevLink = prevGroup ? { href: `/${country}/${prevYear}/${group.slug}`, label: t("prevYearLink", { name: group.name, year: prevYear }) } : null;
  const nextLink = nextGroup ? { href: `/${country}/${nextYear}/${group.slug}`, label: t("nextYearLink", { name: group.name, year: nextYear }) } : null;

  // ---- FAQ (visible copy + FAQPage JSON-LD share one array) ----------------
  const faqItems: FaqItem[] = [
    {
      question: t("faqWhen", { name: group.name, country: countryName, year }),
      answer: facts.multiDate
        ? t("faqWhenMulti", { name: group.name, country: countryName, year, dates: group.dates.map((d) => dayFmt.format(utcDate(d))).join(", ") })
        : t("faqWhenAnswer", { name: group.name, country: countryName, year, date: dateShort }),
    },
    { question: t("faqWeekday", { name: group.name, year }), answer: t("faqWeekdayAnswer", { name: group.name, year, weekday }) },
    {
      question: t("faqScope", { name: group.name, country: countryName }),
      answer: facts.scope === "national"
        ? t("faqScopeNational", { name: group.name, country: countryName })
        : facts.scope === "regional"
        ? t("faqScopeRegional", { name: group.name, country: countryName, count: facts.regionCount })
        : t("faqScopeUnknown", { name: group.name, country: countryName }),
    },
    {
      question: t("faqCountdown", { name: group.name }),
      answer: facts.daysUntil > 0
        ? t("faqCountdownFuture", { name: group.name, days: facts.daysUntil, date: dateShort })
        : facts.daysUntil === 0
        ? t("faqCountdownToday", { name: group.name, date: dateShort })
        : t("faqCountdownPast", { name: group.name, date: dateShort }),
    },
  ];

  // Next-occurrence FAQ: only after the primary date has passed. Answered from
  // the verified next-year group when available; "not announced" when next-year
  // data loaded but the holiday does not recur; omitted on upstream failure.
  if (facts.daysUntil < 0 && attemptedYears.has(nextYear)) {
    const question = t("faqNextOccurrence", { name: group.name, country: countryName });
    if (nextGroup) {
      faqItems.push({ question, answer: t("faqNextOccurrenceAnswer", { name: group.name, country: countryName, date: dayFmt.format(utcDate(nextGroup.primaryDate)) }) });
    } else if (!failedYears.has(nextYear)) {
      faqItems.push({ question, answer: t("faqNextOccurrenceNone", { name: group.name, country: countryName }) });
    }
  }

  // ---- Structured data -----------------------------------------------------
  const canonical = `${SITE_URL}/${locale}/${country}/${year}/${group.slug}`;
  const crumbs = [
    { name: tn("home"), url: `${SITE_URL}/${locale}` },
    { name: countryName, url: `${SITE_URL}/${locale}/${country}` },
    { name: String(year), url: `${SITE_URL}/${locale}/${country}/${year}` },
    { name: group.name, url: canonical },
  ];
  const eventLd = facts.multiDate
    ? holidayEventList(group, country, countryName, locale, canonical)
    : holidayEvent(group, country, countryName, locale, canonical);
  const webPageLd = webPageDetail({
    canonical,
    title: getHolidayDetailTitle(group.name, country, locale, year),
    description: getHolidayDetailDescription(group.name, country, locale, year, dateShort),
    locale,
    dateModified: now.toISOString(),
    eventId: `${canonical}#event`,
  });

  const lastUpdated = now.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage(faqItems)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />

      <div className="space-y-1">
        <Link href={`/${country}/${year}`} className="text-sm text-brand">
          {t("backToYear", { country: countryName, year })}
        </Link>
        <h1 className="text-2xl font-bold leading-tight">{displayName}</h1>
        <p className="text-[var(--muted)]">{countryName} · {year}</p>
      </div>

      <section className="flex items-center gap-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
        <CalendarDays size={32} strokeWidth={1.5} className="shrink-0 text-[var(--brand)]" aria-hidden />
        <div>
          <p className="font-semibold leading-tight">{countdown}</p>
          <p className="text-sm text-[var(--muted)]">{dateLong}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("factsHeading")}</h2>
        <HolidayMetaRows rows={metaRows} />
      </section>

      {facts.multiDate && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t("datesHeading", { year })}</h2>
          <p className="text-sm text-[var(--muted)]">
            {t("multiDateNote", { name: group.name, country: countryName, year, count: group.dates.length })}
          </p>
          <HolidayMultiDate dates={group.dates} locale={locale} dateHeading={t("factDate")} weekdayHeading={t("datesWeekdayHeading")} />
        </section>
      )}

      {group.counties !== null && group.counties.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t("regionsHeading")}</h2>
          <HolidayRegions counties={group.counties} />
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">{t("bridgeHeading")}</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {t(BRIDGE_KEY[facts.bridge], { name: group.name, year, weekday })}
        </p>
      </section>

      <HolidayAdjacentYears heading={t("adjacentHeading")} prev={prevLink} next={nextLink} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t("faqHeading")}</h2>
        <HolidayFaq items={faqItems} />
      </section>

      <HolidaySiblingSection
        heading={t("siblingsHeading", { country: countryName, year })}
        viewAll={t("viewAllYear", { country: countryName, year })}
        groups={groups}
        currentSlug={group.slug}
        country={country}
        year={year}
        locale={locale}
      />

      <HolidaySource
        heading={t("sourceHeading")}
        note={t("sourceNote", { name: group.name, country: countryName, year, date: lastUpdated })}
        officialSource={getOfficialSource(country)}
        officialLabel={t("officialSource")}
      />
    </article>
  );
}
