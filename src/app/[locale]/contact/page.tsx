import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import LegalPage from "@/components/legal/LegalPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";
const CONTACT_EMAIL = "ahmedlzany423@gmail.com";

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
  const title = t("contact");
  return {
    title,
    description: "Get in touch with the PubHoliday team.",
    alternates: { canonical: `${SITE_URL}/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <LegalPage title={t("contact")}>
      <section>
        <p>
          Have a question, found a data issue, or want to share feedback? We would
          love to hear from you.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Email</h2>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[var(--brand)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--fg)]">Response time</h2>
        <p>
          We aim to reply to all messages within a few business days. For billing
          or subscription questions, please include the email associated with your
          account so we can help faster.
        </p>
      </section>
    </LegalPage>
  );
}
