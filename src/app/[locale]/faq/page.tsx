import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "@/components/legal/LegalPage";
import { faqPage } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  const title = t("faq");
  return {
    title,
    description: "Common questions about PubHoliday, plans, and billing.",
    alternates: { canonical: `${SITE_URL}/${locale}/faq` },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  const items = [
    {
      q: "What countries are covered?",
      a: "PubHoliday covers public holidays for 46 countries, with annual updates and calendar subscriptions.",
    },
    {
      q: "What is the difference between Free and Pro?",
      a: "Free includes worldwide holiday lookups, calendar views, and iCal subscriptions. Pro adds multi-year data, a multi-country watchlist, and an ad-free experience.",
    },
    {
      q: "How does billing work?",
      a: "Pro is billed through our payment partner Waffo. It renews automatically until you cancel, and access continues through the end of the paid period.",
    },
    {
      q: "How accurate is the data?",
      a: "We update holiday data annually, but it may be slightly out of date. Always confirm critical dates with official sources before planning.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach us by email at the address listed in the site footer. We typically respond within a few business days.",
    },
  ];
  return (
    <LegalPage title={t("faq")}>
      {/* FAQPage structured data — mirrors the visible Q&A below */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqPage(items.map((i) => ({ question: i.q, answer: i.a })))
          ),
        }}
      />
      <section className="space-y-6">
        {items.map((item) => (
          <div key={item.q}>
            <h2 className="text-base font-semibold text-[var(--fg)]">
              {item.q}
            </h2>
            <p className="mt-1">{item.a}</p>
          </div>
        ))}
      </section>
    </LegalPage>
  );
}
