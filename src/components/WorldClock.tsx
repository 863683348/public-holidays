"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface ZoneDef {
  id: string;
  iana: string;
  label: string;
  country?: string;
}

interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  localName?: string;
}

// Curated major zones. `country` links the zone to a holiday dataset.
const MAJORS: ZoneDef[] = [
  { id: "utc", iana: "UTC", label: "UTC" },
  { id: "ny", iana: "America/New_York", label: "New York", country: "US" },
  { id: "la", iana: "America/Los_Angeles", label: "Los Angeles", country: "US" },
  { id: "lon", iana: "Europe/London", label: "London", country: "GB" },
  { id: "par", iana: "Europe/Paris", label: "Paris", country: "FR" },
  { id: "ber", iana: "Europe/Berlin", label: "Berlin", country: "DE" },
  { id: "dxb", iana: "Asia/Dubai", label: "Dubai", country: "AE" },
  { id: "bjs", iana: "Asia/Shanghai", label: "Beijing", country: "CN" },
  { id: "tyo", iana: "Asia/Tokyo", label: "Tokyo", country: "JP" },
  { id: "sin", iana: "Asia/Singapore", label: "Singapore", country: "SG" },
  { id: "syd", iana: "Australia/Sydney", label: "Sydney", country: "AU" },
  { id: "sao", iana: "America/Sao_Paulo", label: "São Paulo", country: "BR" },
];

function tzParts(iana: string, now: Date) {
  const time = new Intl.DateTimeFormat(undefined, {
    timeZone: iana,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat(undefined, {
    timeZone: iana,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
  const y = new Intl.DateTimeFormat(undefined, { timeZone: iana, year: "numeric" }).format(now);
  const m = new Intl.DateTimeFormat(undefined, { timeZone: iana, month: "2-digit" }).format(now);
  const d = new Intl.DateTimeFormat(undefined, { timeZone: iana, day: "2-digit" }).format(now);
  const offset =
    new Intl.DateTimeFormat(undefined, { timeZone: iana, timeZoneName: "shortOffset" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return { time, date, ymd: `${y}-${m}-${d}`, offset };
}

export default function WorldClock() {
  const t = useTranslations("worldClock");
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [localTz, setLocalTz] = useState<string | null>(null);
  const [holidayMap, setHolidayMap] = useState<Record<string, Holiday[] | null>>({});
  const [loading, setLoading] = useState(true);

  // Detect local timezone + start the 1s ticker after mount (avoids SSR mismatch).
  useEffect(() => {
    setMounted(true);
    setLocalTz(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const zones = useMemo<ZoneDef[]>(() => {
    const list = [...MAJORS];
    if (localTz) {
      const match = MAJORS.find((m) => m.iana === localTz);
      list.unshift({ id: "local", iana: localTz, label: t("local"), country: match?.country });
    }
    return list;
  }, [localTz, t]);

  // Load holiday data for every zone that maps to a country (deduped).
  useEffect(() => {
    let cancelled = false;
    const countries = Array.from(
      new Set(zones.map((z) => z.country).filter((c): c is string => Boolean(c)))
    );
    if (countries.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      countries.map(async (c): Promise<[string, Holiday[] | null]> => {
        const year = new Date().getFullYear();
        try {
          const res = await fetch(`/${locale}/api/holidays?country=${c}&year=${year}`);
          if (!res.ok) return [c, null];
          const data = (await res.json()) as { holidays?: Holiday[] };
          return [c, data.holidays ?? null];
        } catch {
          return [c, null];
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, Holiday[] | null> = {};
      for (const [c, h] of results) map[c] = h;
      setHolidayMap(map);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [zones, locale]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {zones.map((z) => {
        const parts = now ? tzParts(z.iana, now) : null;
        const hol = z.country ? holidayMap[z.country] : undefined;
        let holidayText: string | null = z.country === undefined ? null : t("noData");
        if (z.country !== undefined) {
          if (hol === null) holidayText = t("noData");
          else if (hol === undefined) holidayText = loading ? t("loading") : t("noData");
          else {
            const hit = now ? hol.find((h) => h.date === parts!.ymd) : undefined;
            holidayText = hit ? hit.localName || hit.name : t("noHoliday");
          }
        }
        const isHoliday =
          z.country !== undefined && hol && now ? Boolean(hol.find((h) => h.date === parts!.ymd)) : false;

        return (
          <div
            key={z.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{z.label}</span>
              <span className="text-xs text-[var(--muted)]">{parts?.offset || "—"}</span>
            </div>
            <div className="mt-2 font-mono text-3xl tabular-nums">
              {parts ? parts.time : "--:--:--"}
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              {parts ? parts.date : "—"}
            </div>
            <div className="mt-3 text-sm">
              {isHoliday ? (
                <span className="rounded bg-[var(--brand)]/10 px-2 py-0.5 font-medium text-[var(--brand)]">
                  {t("badge")}: {holidayText}
                </span>
              ) : holidayText !== null ? (
                <span className="text-[var(--muted)]">{holidayText}</span>
              ) : (
                <span className="text-[var(--muted)]">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
