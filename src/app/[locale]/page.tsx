import { getTranslations } from "next-intl/server";
import { GitCompare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { COUNTRIES, POPULAR_COUNTRIES } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import { toISODate } from "@/lib/holiday-dates";
import type { Holiday } from "@/lib/types";
import CountrySelector from "@/components/CountrySelector";
import TodayHolidays from "@/components/TodayHolidays";
import MyHolidays from "@/components/MyHolidays";
import AdSlot from "@/components/AdSlot";

const FEATURED_COUNTRIES = POPULAR_COUNTRIES.slice(0, 8);

// The homepage carries a live "who is off today?" count; hourly re-render keeps
// it from going stale, mirroring the /today utility page's freshness policy.
export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const ta = await getTranslations("homeAbout");
  const year = new Date().getFullYear();

  const featured = await Promise.all(
    FEATURED_COUNTRIES.map(async (c) => {
      let holidays: Holiday[] = [];
      try {
        holidays = [
          ...(await getHolidays(c.code, year)),
          ...(await getHolidays(c.code, year + 1)),
        ];
      } catch {
        // Upstream unavailable: the widget renders an empty state.
      }
      return { code: c.code, holidays };
    })
  );

  // Honest count computed from the same featured set the widget below renders —
  // never a fabricated figure. Local-date semantics match TodayHolidays.
  const todayISO = toISODate(new Date());
  const onHolidayToday = featured.filter((f) =>
    f.holidays.some((h) => h.date === todayISO)
  ).length;

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">{t("heading")}</h1>
        <p className="max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      </section>

      <CountrySelector countries={COUNTRIES} placeholder={t("searchPlaceholder")} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t("popular")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {POPULAR_COUNTRIES.map((c) => (
            <Link
              key={c.code}
              href={`/${c.code}`}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-center font-medium transition hover:border-brand hover:text-brand"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Link
          href="/today"
          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition hover:border-brand"
        >
          <span className="text-sm font-medium">
            {t("todayCount", { count: onHolidayToday })}
          </span>
          <span className="shrink-0 text-sm font-medium text-brand">
            {t("todayCountLink")}
          </span>
        </Link>

        <TodayHolidays countries={featured} />
      </section>

      <MyHolidays />

      <section className="space-y-4">
        <Link
          href="/world-clock"
          className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-brand"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{t("worldClockCard")}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("worldClockCardDesc")}
              </p>
            </div>
            <span className="text-xl text-[var(--muted)]">→</span>
          </div>
        </Link>
      </section>

      <section className="space-y-4">
        <Link
          href={`/compare?c=US,GB,DE&y=${year}`}
          className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-brand"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <GitCompare
                className="mt-0.5 h-5 w-5 text-brand"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-semibold">{t("compareCardTitle")}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {t("compareCardDesc")}
                </p>
              </div>
            </div>
            <span className="text-xl text-[var(--muted)]">→</span>
          </div>
        </Link>
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">{ta("heading")}</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{ta("p1")}</p>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{ta("p2")}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>{ta("li1", { count: COUNTRIES.length })}</li>
          <li>{ta("li2")}</li>
          <li>{ta("li3")}</li>
          <li>{ta("li4")}</li>
        </ul>
        <p className="text-sm">
          <Link
            href={ta("forTeamsLink")}
            className="font-medium text-brand hover:underline"
          >
            {ta("forTeamsLinkLabel")}
          </Link>
        </p>
      </section>

      <AdSlot />
    </div>
  );
}