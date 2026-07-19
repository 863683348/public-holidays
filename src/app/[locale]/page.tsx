import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COUNTRIES, POPULAR_COUNTRIES } from "@/lib/countries";
import CountrySelector from "@/components/CountrySelector";
import AdSlot from "@/components/AdSlot";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");

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

      <AdSlot />
    </div>
  );
}
