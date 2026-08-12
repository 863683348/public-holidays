import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "@/components/legal/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";


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
        <h2 className="text-lg font-semibold text-[var(--fg)]">Refunds</h2>
        <p>
          Pro subscriptions are billed by our payment partner Waffo. Because our
          service is delivered digitally and immediately, subscription fees are
          generally non-refundable, except as described below.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>7-day guarantee for first-time subscribers.</strong> If you
            are a first-time Pro subscriber, you may request a full refund within
            7 days of your first charge, provided the Pro features have not been
            substantially used.
          </li>
          <li>
            <strong>Duplicate or erroneous charges.</strong> If you were charged
            more than once for the same period, we will refund the duplicate
            amount in full.
          </li>
          <li>
            <strong>Statutory rights.</strong> Where applicable law grants a
            cooling-off or withdrawal right (for example in the EU or UK), that
            right is preserved and may override this policy.
          </li>
        </ul>
        <p className="mt-2">
          To request a refund, email{" "}
          <a
            href="mailto:ahmedlzany423@gmail.com"
            className="text-brand hover:underline"
          >
            ahmedlzany423@gmail.com
          </a>{" "}
          with your account email and the transaction ID from your Waffo receipt.
          We confirm requests within 2 business days and issue refunds to the
          original payment method within 5 to 10 business days.
        </p>
        <p className="mt-2">
          Non-refundable: subscription periods already used, refund requests made
          after the 7-day window, and accounts closed for violating these terms.
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
