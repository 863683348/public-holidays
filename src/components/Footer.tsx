"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CONTACT_EMAIL = "ahmedlzany423@gmail.com";

export default function Footer() {
  const t = useTranslations("footer");
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
