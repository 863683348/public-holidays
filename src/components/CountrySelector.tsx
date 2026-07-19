"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Country } from "@/lib/types";

export default function CountrySelector({
  countries,
  placeholder,
}: {
  countries: Country[];
  placeholder: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const t = useTranslations("home");

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-brand"
      />
      <ul className="grid max-h-64 grid-cols-2 gap-2 overflow-auto sm:grid-cols-3">
        {filtered.map((c) => (
          <li key={c.code}>
            <button
              type="button"
              onClick={() => router.push(`/${c.code}`)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-left text-sm transition hover:border-brand hover:text-brand"
            >
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-[var(--muted)]">{c.code}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full text-sm text-[var(--muted)]">
            No countries found.
          </li>
        )}
      </ul>
    </div>
  );
}
