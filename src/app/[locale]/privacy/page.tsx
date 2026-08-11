import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "@/components/legal/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 604800;

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
      <p className="text-sm text-[var(--muted)]">Last updated: August 3, 2026</p>
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
        <h2 className="text-lg font-semibold text-[var(--fg)]">Data controller</h2>
        <p>
          This service is operated by 3C studio (trading as PubHoliday). The entity responsible for
          your personal data (the data controller) is:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Operator: 3C studio (trading as PubHoliday)</li>
          <li>Registered address: China, Shaanxi, Xi&apos;an, Xianxi Xilu Road No. 29</li>
          <li>
            Privacy contact:{" "}
            <a
              href="mailto:ahmedlzany423@gmail.com"
              className="text-brand hover:underline"
            >
              ahmedlzany423@gmail.com
            </a>
          </li>
        </ul>
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
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          Third-party sharing and disclosure
        </h2>
        <p>
          We do not sell your personal data. We share information only with the
          following categories of third parties, under appropriate agreements:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Payment processor — Waffo Pancake.</strong> When you upgrade
            to Pro, we share your buyer name and email, the subscription plan,
            and billing status with Waffo so it can process the payment and
            manage your subscription. Card and payment-instrument data are
            collected and stored by Waffo, a PCI-DSS compliant Merchant of
            Record, and are never transmitted to or stored on our servers.
          </li>
          <li>
            <strong>Authentication — Google.</strong> When you sign in with
            Google, Google provides us with your name, email, and profile
            picture according to your Google account permissions.
          </li>
          <li>
            <strong>Analytics provider.</strong> Privacy-friendly usage analytics
            receives anonymized or aggregated interaction data, such as pages
            visited and locale preference, to help us improve the service.
          </li>
          <li>
            <strong>Legal and compliance.</strong> We may disclose data when
            required by law, court order, or a lawful request from an authorized
            authority.
          </li>
        </ul>
        <p className="mt-2">
          Each third party handles your data under its own privacy policy. We
          recommend reviewing the Waffo and Google policies for details on their
          processing.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Data security</h2>
        <p>We protect your personal data with the following measures:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Encryption in transit.</strong> All traffic between your
            browser and our servers is protected with TLS (HTTPS).
          </li>
          <li>
            <strong>Encryption at rest.</strong> Your data is stored in a managed
            PostgreSQL database with encryption enabled. Sensitive credentials
            are hashed or encrypted; we never store your raw OAuth tokens or
            payment card numbers.
          </li>
          <li>
            <strong>Access control.</strong> We follow the principle of least
            privilege. Database and infrastructure access is limited to
            authorized personnel bound by confidentiality obligations.
          </li>
          <li>
            <strong>Monitoring.</strong> We perform regular security reviews and
            dependency updates to reduce risk.
          </li>
        </ul>
        <p className="mt-2">
          In the event of a security incident that affects your personal data,
          we will notify you and the relevant authorities within 72 hours of
          becoming aware of it, where required by law. You are responsible for
          keeping your account credentials confidential and not sharing them.
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
        <h2 className="text-lg font-semibold text-[var(--fg)]">Advertising</h2>
        <p>
          This website displays advertisements served by Google AdSense, a
          third-party advertising vendor. Google and its partners may use cookies
          (including the DART cookie) and similar technologies to serve ads
          based on your prior visits to this site and other websites, and to
          measure ad performance. You can opt out of personalized advertising by
          visiting Google Ads Settings (
          <a
            href="https://www.google.com/settings/ads"
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.google.com/settings/ads
          </a>
          ) or Your Online Choices (
          <a
            href="http://www.aboutads.info/choices"
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.aboutads.info/choices
          </a>
          ). For more information on how Google uses data, see Google&apos;s
          advertising privacy policy (
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/technologies/ads
          </a>
          ).
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
