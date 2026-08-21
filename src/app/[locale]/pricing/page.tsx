import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import PricingPage from "./PricingClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return {
    title: `${t("title")} — PubHoliday`,
    description: t("subtitle"),
    openGraph: {
      type: "website",
      title: `${t("title")} — PubHoliday`,
      description: t("subtitle"),
      url: `${SITE_URL}/${locale}/pricing`,
      locale,
    },
  };
}

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  const status = (await searchParams).status;
  return <PricingPage userEmail={session?.user?.email ?? null} status={status ?? null} />;
}
