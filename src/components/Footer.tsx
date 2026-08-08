"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const CONTACT_EMAIL = "ahmedlzany423@gmail.com";

export default function Footer() {
  const t = useTranslations("footer");

  const toolLinks = [
    { href: "/", label: t("tools_today") },
    { href: "/US/2026", label: t("tools_calendar") },
    { href: "/", label: t("tools_country") },
    { href: "/world-clock", label: t("tools_clock") },
  ] as const;

  const aboutLinks = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/faq", label: t("faq") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* 4 列主体 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 列 1：品牌区 */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-sm font-bold text-white">
                📅
              </span>
              <span className="text-base font-semibold text-[var(--fg)]">{t("brand")}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">{t("slogan")}</p>
            <p className="mt-3 text-xs text-[var(--muted)] opacity-80">{t("builtWith")}</p>
          </div>

          {/* 列 2：工具 */}
          <nav aria-label={t("tools")}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--fg)]">{t("tools")}</h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 列 3：关于 */}
          <nav aria-label={t("about")}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--fg)]">{t("about")}</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 列 4：语言切换 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--fg)]">{t("language")}</h3>
            <div className="flex flex-wrap gap-1">
              <LocaleSwitcher />
            </div>
          </div>
        </div>

        {/* 底部版权行 */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} {t("brand")} · {t("copyright")}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {t.rich("contactEmail", {
              email: (chunks) => (
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
