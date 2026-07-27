import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// BCP 47 language tag mapping for precise <html lang> attribute
// URL path uses simple locale (e.g., "/en/"), but HTML lang gets precise tag (e.g., "en-US")
const LANG_MAP: Record<string, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
  pt: "pt-PT",
  it: "it-IT",
  ru: "ru-RU",
  ar: "ar-SA",
};

const JSON_BASE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PubHoliday",
  url: SITE_URL,
  description: "Know the holidays. Beat the calendar.",
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
  const title = `${t("title")} — ${t("tagline")}`;
  const description = t("tagline");
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
  );
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "PubHoliday",
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    <html
      lang={LANG_MAP[locale] || locale}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...JSON_BASE, inLanguage: locale }) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <header className="border-b border-[var(--border)]">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Link
                  href="/"
                  className="text-lg font-semibold text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-sm"
                >
                  PubHoliday
                </Link>
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
