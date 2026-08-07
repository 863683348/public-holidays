"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, Check, Search, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { COMPARE_MAX, COMPARE_MIN } from "@/lib/compare";
import { comparePath } from "./shareUrl";

export interface CountryOption {
  code: string;
  name: string;
  nameEn: string;
}

const chipBase =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] ps-3 pe-1.5 py-1.5 text-sm";
const actionBase =
  "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]";

/**
 * 2–6 country picker: selected countries as removable chips + a search
 * dropdown to add more. Every mutation re-navigates to a new share URL — the
 * server re-renders the matrix for the new selection (no local-only state).
 */
export default function MultiSelect({
  codes,
  year,
  countryOptions,
}: {
  codes: string[];
  year: number;
  countryOptions: CountryOption[];
}) {
  const t = useTranslations("compare");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => {
    const byCode = new Map(countryOptions.map((c) => [c.code, c]));
    return codes.map((code) => byCode.get(code) ?? { code, name: code, nameEn: code });
  }, [codes, countryOptions]);

  const candidates = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return countryOptions.filter(
      (c) =>
        !codes.includes(c.code) &&
        (!needle ||
          c.name.toLowerCase().includes(needle) ||
          c.nameEn.toLowerCase().includes(needle) ||
          c.code.toLowerCase().includes(needle))
    );
  }, [q, codes, countryOptions]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQ("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const remove = (code: string) => {
    if (codes.length <= COMPARE_MIN) return;
    router.replace(comparePath(codes.filter((c) => c !== code), year));
  };

  const add = (code: string) => {
    if (codes.includes(code) || codes.length >= COMPARE_MAX) return;
    setQ("");
    router.replace(comparePath([...codes, code], year));
  };

  const atMax = codes.length >= COMPARE_MAX;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
        {t("pickCountries")}
      </h2>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label={t("pickCountries")}
      >
        {selected.map((c) => (
          <span key={c.code} className={chipBase}>
            <span className="max-w-[160px] truncate font-medium">{c.name}</span>
            <span className="text-xs text-[var(--muted)]">{c.code}</span>
            <button
              type="button"
              onClick={() => remove(c.code)}
              disabled={codes.length <= COMPARE_MIN}
              aria-label={t("removeCountry", { country: c.name })}
              className="rounded-full p-1 text-[var(--muted)] transition-colors hover:bg-[var(--highlight)] hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
            >
              <X size={14} aria-hidden />
            </button>
          </span>
        ))}

        <div className="relative" ref={rootRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            disabled={atMax}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={t("ariaAddCountry")}
            title={atMax ? t("maxCountries") : undefined}
            className={`${actionBase} ${
              atMax
                ? "cursor-not-allowed border-[var(--border)] text-[var(--muted)] opacity-50"
                : "border-[var(--border)] text-[var(--fg)] hover:border-[var(--brand)] hover:text-brand"
            }`}
          >
            <Plus size={16} aria-hidden />
            <span className="hidden sm:inline">{t("addCountry")}</span>
            <ChevronDown size={14} aria-hidden />
          </button>

          {open && (
            <div className="absolute end-0 z-20 mt-2 w-72 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 shadow-md">
              <div className="relative">
                <Search
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("addCountryPlaceholder")}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="compare-country-list"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] py-2 pe-3 ps-8 text-sm outline-none focus:border-brand"
                />
              </div>
              <ul
                id="compare-country-list"
                role="listbox"
                className="mt-2 max-h-64 overflow-auto"
              >
                {candidates.map((c) => (
                  <li key={c.code} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => add(c.code)}
                      className="flex w-full min-h-[44px] items-center justify-between gap-2 rounded-md px-3 py-2.5 text-start text-sm transition-colors hover:bg-[var(--highlight)] focus-visible:outline-none focus-visible:[box-shadow:var(--focus-ring)]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {c.name}
                        </span>
                        <span className="block text-xs text-[var(--muted)]">
                          {c.nameEn}
                        </span>
                      </span>
                      {codes.includes(c.code) && (
                        <Check size={16} aria-hidden className="shrink-0 text-brand" />
                      )}
                    </button>
                  </li>
                ))}
                {candidates.length === 0 && (
                  <li className="px-3 py-2 text-sm text-[var(--muted)]">
                    {t("noResults")}
                  </li>
                )}
              </ul>
              {atMax ? (
                <p className="mt-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
                  {t("maxCountries")}
                </p>
              ) : (
                codes.length < COMPARE_MIN && (
                  <p className="mt-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
                    {t("minCountries")}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
