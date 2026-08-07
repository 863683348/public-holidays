"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Check, ChevronDown, Globe } from "lucide-react";

const LABELS: Record<Locale, string> = {
  en: "EN",
  ja: "JA",
  es: "ES",
  de: "DE",
  fr: "FR",
  pt: "PT",
  it: "IT",
  ko: "KO",
  ru: "RU",
  ar: "AR",
  zh: "中文",
};

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape; reset on locale change.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-sm font-medium text-[var(--fg)] transition-colors hover:border-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <Globe className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden />
        <span>{LABELS[locale] ?? locale.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="absolute right-0 top-full z-50 mt-1 max-h-72 w-40 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--card)] py-1 text-sm shadow-lg"
        >
          {routing.locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => pick(l)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors hover:bg-[var(--muted)]/40 ${
                  l === locale ? "font-semibold text-brand" : "text-[var(--fg)]"
                }`}
              >
                <span>{LABELS[l] ?? l}</span>
                {l === locale && <Check className="h-3.5 w-3.5" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}