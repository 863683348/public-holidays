import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import WorldClock from "@/components/WorldClock";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("worldClock");
  return {
    title: t("title"),
    alternates: { canonical: `${SITE_URL}/${locale}/world-clock` },
    openGraph: {
      type: "website",
      title: t("title"),
      url: `${SITE_URL}/${locale}/world-clock`,
      locale,
    },
  };
}

export default async function WorldClockPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("worldClock");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link href="/" className="text-sm text-[var(--brand)]">
          ←
        </Link>
      </div>
      <WorldClock />
    </div>
  );
}
