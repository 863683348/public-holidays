import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import SessionProvider from "@/components/SessionProvider";
import GoogleLogin from "@/components/GoogleLogin";
import MobileMenu from "@/components/MobileMenu";
import "../globals.css";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";

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
  nl: "nl-NL",
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
    metadataBase: new URL(SITE_URL),
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
      // No hard-coded og:url: metadataBase + pathname makes Next generate the
      // correct absolute og:url per child page (e.g. /en/GB/2027) instead of
      // every page inheriting a locale-only /en URL.
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "waffo-verify": "45acd08c8d9ce4f6e9e7368fc2549397",
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
  // Static-render friendly: pin the request locale so next-intl's implicit
  // getLocale() never falls back to reading cookies (which would force the
  // whole layout segment — and every child page — to dynamic rendering).
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={LANG_MAP[locale] || locale}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BVFTRDHV2H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BVFTRDHV2H');
          `}
        </Script>
        <Script
          id="adsense-auto-ads"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-9043592188127461"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...JSON_BASE, name: (messages as any).site?.title ?? "PubHoliday", description: (messages as any).site?.tagline ?? "Know the holidays. Beat the calendar.", inLanguage: locale }) }}
        />
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <header className="border-b border-[var(--border)]">
              <div className="flex w-full items-center justify-between gap-2 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-4">
                <Link
                  href="/"
                  className="text-lg font-semibold text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-sm"
                >
                  PubHoliday
                </Link>
                <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap text-sm sm:gap-3 md:flex overflow-x-auto">
                  <Link
                    href="/compare"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("compare")}
                  </Link>
                  <Link
                    href="/today"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("today")}
                  </Link>
                  <Link
                    href="/world-clock"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("worldClock")}
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("pricing")}
                  </Link>
                  <Link
                    href="/blog"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("blog")}
                  </Link>
                  <Link
                    href="/account"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("account")}
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-2">
                <MobileMenu />
                <div className="hidden md:block">
                  <GoogleLogin />
                </div>
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
          </SessionProvider>
      </body>
    </html>
  );
}

