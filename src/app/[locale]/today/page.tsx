import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Globe2, Clock3 } from "lucide-react";
import { COUNTRIES, NO_DATA_COUNTRIES } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import type { Country, Holiday } from "@/lib/types";
import TodayHolidays from "@/components/TodayHolidays";
import AdSlot from "@/components/AdSlot";
import TodayClockAside from "@/components/today/TodayClockAside";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

// O2 default freshness: 1 h. "Today" goes stale for half the planet within a
// few hours (Asia-Pacific crosses midnight first), so hourly beats daily.
// This is a noindex utility — daily-changing content has no long-tail crawl
// value, and the URL is intentionally kept out of every sitemap.

// Worker-pool concurrency cap mirroring holidays/sitemap.ts. The 110-country
// fan-out is the hot path on cold renders; the 90-day fetch cache absorbs
// repeat hits, and allSettled keeps one flaky upstream from blocking the page.
const CONCURRENCY = 10;

async function fetchHolidaysForAll(
  countries: Country[],
  year: number
): Promise<PromiseSettledResult<Holiday[]>[]> {
  const out = new Array<PromiseSettledResult<Holiday[]>>(countries.length);
  let cursor = 0;
  async function worker() {
    while (cursor < countries.length) {
      const i = cursor++;
      try {
        out[i] = {
          status: "fulfilled",
          value: await getHolidays(countries[i].code, year),
        };
      } catch (reason) {
        out[i] = { status: "rejected", reason };
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "today" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    // Utility page: the content changes every day, so it must never be indexed.
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}/${locale}/today` },
  };
}

export default async function TodayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "today" });

  // UTC is the single source of truth for "today" — never the server's local
  // zone. The Asia-Pacific cross-midnight edge is called out in the UI copy.
  const today = new Date().toISOString().slice(0, 10);
  const year = Number(today.slice(0, 4));

  // Skip the 7 countries the upstream has no data for (mirrors
  // holidays/sitemap.ts) — they'd only yield 204/[] and pollute the list.
  const fetchable = COUNTRIES.filter(
    (c) => !NO_DATA_COUNTRIES.has(c.code.toUpperCase())
  );
  const results = await fetchHolidaysForAll(fetchable, year);
  const byCode = new Map<string, Holiday[]>();
  results.forEach((r, i) => {
    if (r.status === "fulfilled") byCode.set(fetchable[i].code, r.value);
  });

  // Pass the full catalogue to the client widget — it already maps any array,
  // computing "today" and "next holiday" per country on the client.
  const countries = COUNTRIES.map((c) => ({
    code: c.code,
    holidays: byCode.get(c.code) ?? [],
  }));

  const anyData = countries.some((c) => c.holidays.length > 0);
  const onHolidayCount = countries.filter((c) =>
    c.holidays.some((h) => h.date === today)
  ).length;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("heroTitle")}</h1>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-2 text-brand">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t("eyebrow")}
            </span>
          </div>
          <p className="mt-3 text-5xl font-bold tabular-nums tracking-tight">
            {onHolidayCount}
          </p>
          <p className="mt-1 text-base font-medium text-[var(--muted)]">
            {t("heroCount", { count: onHolidayCount })}
          </p>
          <p className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
            {t("asOf", { date: today })}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{t("utcNote")}</p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          {!anyData ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-medium">{t("upstreamUnavailable")}</p>
            </div>
          ) : onHolidayCount > 0 ? (
            <TodayHolidays countries={countries} />
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-medium">{t("emptyStateTitle")}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("emptyState")}
              </p>
              <Link
                href="/compare"
                className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
              >
                {t("emptyCta")}
              </Link>
            </div>
          )}
        </div>

        <aside className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              {t("clockTitle")}
            </h2>
          </div>
          <TodayClockAside />
        </aside>
      </div>

      <AdSlot />
    </div>
  );
}
