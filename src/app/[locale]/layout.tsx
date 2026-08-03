import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import SessionProvider from "@/components/SessionProvider";
import GoogleLogin from "@/components/GoogleLogin";
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
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-5">
                <Link
                  href="/"
                  className="text-lg font-semibold text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-sm"
                >
                  PubHoliday
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                  <Link
                    href="/pricing"
                    className="text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {tNav("pricing")}
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
                <GoogleLogin />
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

const CONTACT_EMAIL = "ahmedlzany423@gmail.com";

async function Footer() {
  const t = await getTranslations("footer");
  const links = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/faq", label: t("faq") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ] as const;
  return (
    <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-[var(--muted)]">
      <nav className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p>{t("disclaimer")}</p>
      <p className="mt-2">
        {t.rich("contactEmail", {
          email: (chunks) => (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--brand)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </footer>
  );
}
