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
  const title = t("privacy");
  return {
    title,
    description:
      "How PubHoliday collects, uses, and protects your personal data.",
    alternates: { canonical: `${SITE_URL}/${locale}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <LegalPage title={t("privacy")}>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Overview</h2>
        <p>
          This Privacy Policy explains what information PubHoliday collects when
          you visit our site, how we use it, and the choices you have. We aim to
          be transparent and to collect only what we need to operate and improve
          the service.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          Information we collect
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Account data you provide when signing in with Google (name, email,
            profile picture).
          </li>
          <li>
            Subscription and billing status received from our payment partner,
            Waffo.
          </li>
          <li>
            Usage data such as pages visited and locale preference, collected via
            privacy-friendly analytics.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          How we use information
        </h2>
        <p>
          We use your information to provide the calendar, manage your Pro
          subscription, respond to support requests, and understand aggregate
          usage so we can improve the product. We do not sell your personal data.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by contacting us at the email listed in the site
          footer. We will respond within a reasonable timeframe.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          reflected on this page.
        </p>
      </section>
    </LegalPage>
  );
}
