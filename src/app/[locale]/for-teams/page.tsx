import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarRange,
  Globe2,
  Languages,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { COUNTRIES } from "@/lib/countries";
import { breadcrumb, faqPage } from "@/lib/seo";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 604800;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forTeams" });
  const count = COUNTRIES.length;
  const langs = routing.locales.length;
  const path = `${SITE_URL}/${locale}/for-teams`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription", { count, langs }),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/for-teams`])
      ),
    },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription", { count, langs }),
      url: path,
      locale,
    },
  };
}

export default async function ForTeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forTeams" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const countryCount = COUNTRIES.length;
  const langCount = routing.locales.length;
  const featured = COUNTRIES.filter((c) => c.popular).slice(0, 8);

  const faqItems: FaqItem[] = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A", { langs: langCount }) },
    { question: t("faq5Q"), answer: t("faq5A") },
  ];

  const crumbs = [
    { name: tNav("home"), url: `${SITE_URL}/${locale}` },
    { name: t("metaTitle"), url: `${SITE_URL}/${locale}/for-teams` },
  ];

  const statIcon = "h-5 w-5 text-brand";

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero — asymmetric: narrative on the left, live coverage card on the right */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-brand">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {t("heroLead")}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {t("heroNote", { count: countryCount, langs: langCount })}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
            >
              {t("heroPrimaryCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#value"
              className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
            >
              {t("heroSecondaryCta")}
            </a>
          </div>
        </div>

        {/* Real-data coverage card — country codes drawn from COUNTRIES at render time */}
        <aside
          aria-label={t("coverageCardTitle")}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <p className="text-sm font-semibold text-[var(--fg)]">
            {t("coverageCardTitle")}
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {featured.map((c) => (
              <span
                key={c.code}
                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-center text-xs font-semibold tabular-nums text-[var(--fg)]"
              >
                {c.code}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {t("coverageCardBody", { count: countryCount })}
          </p>
        </aside>
      </section>

      {/* Value blocks — dynamic numbers derived at render time, never hardcoded */}
      <section id="value" className="scroll-mt-8">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          {t("valueEyebrow")}
        </p>
        <h2 className="mt-2 max-w-[30ch] text-2xl font-bold tracking-tight sm:text-3xl">
          {t("valueHeading")}
        </h2>
        <p className="mt-3 max-w-[65ch] text-[var(--muted)]">
          {t("valueSubtitle")}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] p-6">
            <Globe2 className={statIcon} aria-hidden="true" />
            <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight">
              {countryCount}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
              {t("valueCoverageStatLabel")}
            </p>
            <h3 className="mt-4 font-semibold">{t("valueCoverageTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {t("valueCoverageBody", { count: countryCount })}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] p-6">
            <Languages className={statIcon} aria-hidden="true" />
            <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight">
              {langCount}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
              {t("valueLanguagesStatLabel")}
            </p>
            <h3 className="mt-4 font-semibold">{t("valueLanguagesTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {t("valueLanguagesBody", { langs: langCount })}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] p-6">
            <CalendarDays className={statIcon} aria-hidden="true" />
            <p className="mt-4 text-5xl font-bold tracking-tight">iCal</p>
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
              {t("valueCalendarStatLabel")}
            </p>
            <h3 className="mt-4 font-semibold">{t("valueCalendarTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {t("valueCalendarBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Use cases — narrative only, no fabricated customer data */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("useHeading")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <Users className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{t("use1Title")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {t("use1Body")}
            </p>
          </div>
          <div>
            <Building2 className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{t("use2Title")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {t("use2Body")}
            </p>
          </div>
          <div>
            <CalendarRange className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{t("use3Title")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {t("use3Body")}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          {t("faqEyebrow")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("faqHeading")}
        </h2>
        <p className="mt-3 text-[var(--muted)]">{t("faqSubtitle")}</p>
        <FaqAccordion items={faqItems} defaultOpen headingLevel="h3" className="mt-6" />
      </section>

      {/* CTA band — "try Pro for your team", never "upgrade" */}
      <section className="rounded-xl border border-brand/30 bg-[var(--card)] p-8 text-center sm:p-12">
        <h2 className="mx-auto max-w-[24ch] text-2xl font-bold tracking-tight sm:text-3xl">
          {t("ctaTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-[var(--muted)]">
          {t("ctaBody", { count: countryCount })}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
          >
            {t("ctaPrimary")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/compare"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </section>

      {/* Structured data: FAQPage + BreadcrumbList (indexable page) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage(faqItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb(crumbs)) }}
      />
    </div>
  );
}
