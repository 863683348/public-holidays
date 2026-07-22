import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PubHoliday",
  url: SITE_URL,
  description: "Know the holidays. Beat the calendar.",
  inLanguage: routing.locales,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${t("title")} — ${t("tagline")}`,
    description: t("tagline"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <header className="border-b border-[var(--border)]">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <span className="text-lg font-semibold text-brand">
                  PubHoliday
                </span>
                <div className="flex items-center gap-2">
                  <LocaleSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-[var(--muted)]">
      <p>{t("disclaimer")}</p>
    </footer>
  );
}
