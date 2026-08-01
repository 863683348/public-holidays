import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import PricingPage from "./PricingClient";

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
