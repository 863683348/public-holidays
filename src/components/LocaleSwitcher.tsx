"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  de: "DE",
  fr: "FR",
  zh: "中文",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  return (
    <div className="flex items-center gap-1" aria-label={t("label")}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded px-2 py-1 text-xs transition ${
            l === locale
              ? "font-bold text-brand"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          {LABELS[l] ?? l}
        </button>
      ))}
    </div>
  );
}
