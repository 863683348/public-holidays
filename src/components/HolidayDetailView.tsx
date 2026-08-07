import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCountry, getCountryName, getOfficialSource } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { groupHolidays, slugifyHoliday } from "@/lib/slug";
import { deriveHolidayFacts, type BridgeAdvice } from "@/lib/holiday-facts";
import {
  breadcrumb,
  faqPage,
  holidayEvent,
  holidayEventList,
} from "@/lib/seo";
import HolidayFaq, { type FaqItem } from "@/components/HolidayFaq";
import HolidaySiblingList from "@/components/HolidaySiblingList";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

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

  // Canonical country code: getCountry is case-insensitive, so /en/us/… must
  // 308 to /en/US/… to avoid duplicate canonical variants (ADR-001 §3.4).
  if (country !== meta.code) {
    permanentRedirect(`/${locale}/${meta.code}/${year}/${slug}`);
  }

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
        <Link href={`/${country}/${year}`} className="text-sm text-brand">
          {t("backToYear", { country: countryName, year })}
        </Link>
        <p className="text-[var(--muted)]">{tc("dataLag")}</p>
      </div>
    );
  }

  const groups = groupHolidays(holidays);
  let group = groups.find((g) => g.slug === slug);
  if (!group) {
    // Non-canonical slug (wrong case / diacritics / stray punctuation) → 301 to
    // the canonical URL; a truly unknown slug → 404. slugifyHoliday normalises
    // the incoming slug exactly the way stored slugs are computed.
    const canonical = slugifyHoliday(slug);
    const match = groups.find((g) => g.slug === canonical);
    if (match && match.slug !== slug) {
      permanentRedirect(`/${locale}/${country}/${year}/${match.slug}`);
    }
    if (!match) notFound();
    group = match;
  }

  const now = new Date();
  const facts = deriveHolidayFacts(group, now);

  // Locale-aware, timezone-safe formatting (all dates parsed as UTC midnight).
  const longFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const dayFmt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const weekdayFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  });

  const primary = utcDate(group.primaryDate);
  const weekday = weekdayFmt.format(primary);
  const dateLong = longFmt.format(primary);
  const dateShort = dayFmt.format(primary);
  const allDates = group.dates.map((d) => dayFmt.format(utcDate(d)));

  const displayName =
    group.localName && group.localName !== group.name
      ? `${group.name} (${group.localName})`
      : group.name;

  // ---- Countdown line ------------------------------------------------------
  let countdown: string;
  if (facts.daysUntil === 0) countdown = t("countdownToday", { name: group.name });
  else if (facts.daysUntil === 1)
    countdown = t("countdownTomorrow", { name: group.name });
  else if (facts.daysUntil > 1)
    countdown = t("countdownFuture", { name: group.name, days: facts.daysUntil });
  else countdown = t("countdownPast", { name: group.name });

  // ---- Scope + type --------------------------------------------------------
  const scopeLabel =
    facts.scope === "national"
      ? t("scopeNational")
      : facts.scope === "regional"
      ? t("scopeRegional", { count: facts.regionCount })
      : t("scopeUnknown");
  const typeLabel = [facts.isPublic ? t("typePublic") : null, ...facts.otherTypes]
    .filter(Boolean)
    .join(" · ");

  // ---- FAQ (visible copy + FAQPage JSON-LD share one array) ----------------
  const faqItems: FaqItem[] = [
    {
      question: t("faqWhen", { name: group.name, country: countryName, year }),
      answer: facts.multiDate
        ? t("faqWhenMulti", {
            name: group.name,
            country: countryName,
            year,
            dates: allDates.join(", "),
          })
        : t("faqWhenAnswer", {
            name: group.name,
            country: countryName,
            year,
            date: dateShort,
          }),
    },
    {
      question: t("faqWeekday", { name: group.name, year }),
      answer: t("faqWeekdayAnswer", { name: group.name, year, weekday }),
    },
    {
      question: t("faqScope", { name: group.name, country: countryName }),
      answer:
        facts.scope === "national"
          ? t("faqScopeNational", { name: group.name, country: countryName })
          : facts.scope === "regional"
          ? t("faqScopeRegional", {
              name: group.name,
              country: countryName,
              count: facts.regionCount,
            })
          : t("faqScopeUnknown", { name: group.name, country: countryName }),
    },
    {
      question: t("faqCountdown", { name: group.name }),
      answer:
        facts.daysUntil > 0
          ? t("faqCountdownFuture", {
              name: group.name,
              days: facts.daysUntil,
              date: dateShort,
            })
          : facts.daysUntil === 0
          ? t("faqCountdownToday", { name: group.name, date: dateShort })
          : t("faqCountdownPast", { name: group.name, date: dateShort }),
    },
  ];

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

  const officialSource = getOfficialSource(country);
  const lastUpdated = now.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb(crumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage(faqItems)) }}
      />

      <div className="space-y-1">
        <Link href={`/${country}/${year}`} className="text-sm text-brand">
          {t("backToYear", { country: countryName, year })}
        </Link>
        <h1 className="text-2xl font-bold leading-tight">{displayName}</h1>
        <p className="text-[var(--muted)]">
          {countryName} · {year}
        </p>
      </div>

      <section className="flex items-center gap-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
        <CalendarDays
          size={32}
          strokeWidth={1.5}
          className="shrink-0 text-[var(--brand)]"
          aria-hidden
        />
        <div>
          <p className="font-semibold leading-tight">{countdown}</p>
          <p className="text-sm text-[var(--muted)]">{dateLong}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("factsHeading")}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Fact label={t("factDate")} value={dateLong} />
          <Fact label={t("factWeekday")} value={weekday} />
          <Fact label={t("factScope")} value={scopeLabel} />
          {typeLabel && <Fact label={t("factType")} value={typeLabel} />}
        </dl>
      </section>

      {facts.multiDate && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t("datesHeading", { year })}</h2>
          <p className="text-sm text-[var(--muted)]">
            {t("multiDateNote", {
              name: group.name,
              country: countryName,
              year,
              count: group.dates.length,
            })}
          </p>
          <ul className="list-inside list-disc text-sm text-[var(--muted)]">
            {allDates.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">{t("bridgeHeading")}</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {t(BRIDGE_KEY[facts.bridge], { name: group.name, year, weekday })}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t("faqHeading")}</h2>
        <HolidayFaq items={faqItems} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          {t("siblingsHeading", { country: countryName, year })}
        </h2>
        <HolidaySiblingList
          groups={groups}
          currentSlug={group.slug}
          country={country}
          year={year}
          locale={locale}
        />
        <Link
          href={`/${country}/${year}`}
          className="inline-block text-sm text-brand hover:underline"
        >
          {t("viewAllYear", { country: countryName, year })}
        </Link>
      </section>

      <section className="space-y-1 rounded-lg border border-[var(--border)] p-4 text-sm">
        <h2 className="font-semibold">{t("sourceHeading")}</h2>
        <p className="leading-relaxed text-[var(--muted)]">
          {t("sourceNote", {
            name: group.name,
            country: countryName,
            year,
            date: lastUpdated,
          })}
        </p>
        {officialSource && (
          <p className="leading-relaxed">
            <span className="text-[var(--muted)]">{t("officialSource")} </span>
            <a
              href={officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-brand hover:underline"
            >
              {officialSource}
            </a>
          </p>
        )}
      </section>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
