import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "@/components/legal/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 86400;

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
  const title = t("terms");
  return {
    title,
    description:
      "The terms that govern your use of PubHoliday and its Pro subscription.",
    alternates: { canonical: `${SITE_URL}/${locale}/terms` },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <LegalPage title={t("terms")}>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Acceptance</h2>
        <p>
          By accessing or using PubHoliday you agree to these Terms of Service.
          If you do not agree, please discontinue use of the service.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Use of the service</h2>
        <p>
          PubHoliday provides public holiday information for reference. You may
          browse, search, and subscribe to calendar feeds for personal and
          business planning. You may not resell the data or use it to build a
          competing commercial product without our written permission.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Pro subscription</h2>
        <p>
          Pro is a paid plan billed through our payment partner, Waffo.
          Subscriptions renew automatically until canceled. You can cancel at any
          time; access continues until the end of the paid period. Holiday data
          is provided as-is and may be slightly out of date.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          Limitation of liability
        </h2>
        <p>
          We strive for accuracy but cannot guarantee that every date is correct
          for every jurisdiction. Always confirm critical dates with official
          sources. PubHoliday is not liable for decisions made based on this data.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Termination</h2>
        <p>
          We may suspend or terminate access for abuse or violation of these
          terms. Upon termination, your right to use the service ends
          immediately.
        </p>
      </section>
    </LegalPage>
  );
}
