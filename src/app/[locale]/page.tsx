import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COUNTRIES, POPULAR_COUNTRIES } from "@/lib/countries";
import { getHolidays } from "@/lib/holidays";
import type { Holiday } from "@/lib/types";
import CountrySelector from "@/components/CountrySelector";
import TodayHolidays from "@/components/TodayHolidays";
import MyHolidays from "@/components/MyHolidays";
import AdSlot from "@/components/AdSlot";

const FEATURED_COUNTRIES = POPULAR_COUNTRIES.slice(0, 8);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
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

      <TodayHolidays countries={featured} />

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

      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">About PubHoliday</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          PubHoliday is a free, fast public-holiday calendar covering countries
          across every region. Whether you are planning time off, scheduling
          shipments, or simply checking what is closed this week, you can look up
          official public holidays, observances, and long weekends in seconds.
        </p>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Pick a country from the list above to see its full holiday calendar for
          the current and next year. We highlight long weekends so you can make
          the most of bridging days, and our world clock keeps you in sync with
          local time anywhere.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>Up-to-date official public holidays for {COUNTRIES.length} countries and regions.</li>
          <li>Long-weekend detection to help you plan extended breaks.</li>
          <li>Current-time world clock alongside each country&apos;s calendar.</li>
          <li>Subscribe to Pro for saved countries, personal holiday lists, and ICS exports.</li>
        </ul>
      </section>

      <AdSlot />
    </div>
  );
}