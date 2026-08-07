"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Country } from "@/lib/types";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Group by the English name's first letter — digits/other lead names land in
// the "#" bucket. Kept deterministic so SSR HTML and client render agree.
function firstLetter(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(ch) ? ch : "#";
}

export default function CountriesDirectory({
  countries,
  popular,
}: {
  countries: Country[];
  popular: Country[];
}) {
  const t = useTranslations("countries");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      query === ""
        ? countries
        : countries.filter(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.code.toLowerCase().includes(query)
          ),
    [countries, query]
  );

  // Bucket the (possibly searched) list by first letter, then flatten into a
  // stable A–Z + "#" order so the index bar can disable empty letters.
  const groups = useMemo(() => {
    const map = new Map<string, Country[]>();
    for (const c of filtered) {
      const letter = firstLetter(c.name);
      const bucket = map.get(letter) ?? [];
      bucket.push(c);
      map.set(letter, bucket);
    }
    const ordered = LETTERS.map((l) => ({ letter: l, items: map.get(l) ?? [] }));
    if (map.has("#")) ordered.push({ letter: "#", items: map.get("#")! });
    return ordered;
  }, [filtered]);

  const activeLetters = useMemo(
    () => new Set(groups.filter((g) => g.items.length > 0).map((g) => g.letter)),
    [groups]
  );

  const scrollTo = (letter: string) => {
    document
      .getElementById(`letter-${letter}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rowClass =
    "flex items-center justify-between gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm transition hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30";

  const indexBtnClass =
    "min-h-[36px] min-w-[32px] shrink-0 rounded-md px-2 text-sm font-medium tabular-nums text-[var(--muted)] transition hover:bg-[var(--card)] hover:text-brand disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30";

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-3 pl-10 pr-4 outline-none focus:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/30"
        />
      </div>

      {/* A–Z index — sticky so users can jump groups while scrolled down */}
      <nav
        aria-label={t("indexLabel")}
        className="sticky top-0 z-10 -mx-1 flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--bg)] px-1 py-2"
      >
        {LETTERS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => scrollTo(l)}
            disabled={!activeLetters.has(l)}
            className={indexBtnClass}
          >
            {l}
          </button>
        ))}
        <button
          type="button"
          onClick={() => scrollTo("#")}
          disabled={!activeLetters.has("#")}
          className={indexBtnClass}
        >
          #
        </button>
      </nav>

      {query === "" && popular.length > 0 && (
        <section id="popular" className="scroll-mt-16">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("popularGroup")}
          </h2>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {popular.map((c) => (
              <li key={c.code}>
                <Link href={`/${c.code}`} className={rowClass}>
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--muted)]">
                    {c.code}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-6 text-center text-sm text-[var(--muted)]">
          {t("noResults")}
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((g) =>
            g.items.length === 0 ? null : (
              <section
                key={g.letter}
                id={`letter-${g.letter}`}
                className="scroll-mt-16"
              >
                <h2 className="mb-2 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  <span>{g.letter}</span>
                  <span className="text-xs font-normal tabular-nums text-[var(--muted)]">
                    ({g.items.length})
                  </span>
                </h2>
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {g.items.map((c) => (
                    <li key={c.code}>
                      <Link href={`/${c.code}`} className={rowClass}>
                        <span className="truncate font-medium">{c.name}</span>
                        <span className="shrink-0 text-xs tabular-nums text-[var(--muted)]">
                          {c.code}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}
        </div>
      )}
    </div>
  );
}
