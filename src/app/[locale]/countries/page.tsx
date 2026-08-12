import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { COUNTRIES, POPULAR_COUNTRIES } from "@/lib/countries";
import CountriesDirectory from "@/components/countries/CountriesDirectory";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// Indexable SEO hub — content refreshes with the yearly dataset.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countries" });
  const path = `${SITE_URL}/${locale}/countries`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription", { count: COUNTRIES.length }),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/countries`])
      ),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription", { count: COUNTRIES.length }),
      url: path,
      locale,
    },
  };
}

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countries" });
  const count = COUNTRIES.length;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">{t("heading")}</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          {t("intro", { count })}
        </p>
      </section>

      <CountriesDirectory countries={COUNTRIES} popular={POPULAR_COUNTRIES} />
    </div>
  );
}
