"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock3 } from "lucide-react";

// Format helpers wrap Intl so an invalid locale falls back to English instead
// of throwing during render.
function formatLocal(locale: string, now: Date): string {
  try {
    return new Intl.DateTimeFormat(locale, { timeStyle: "medium" }).format(now);
  } catch {
    return new Intl.DateTimeFormat("en", { timeStyle: "medium" }).format(now);
  }
}

function formatUtc(locale: string, now: Date): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      timeStyle: "medium",
    }).format(now);
  } catch {
    return new Intl.DateTimeFormat("en", {
      timeZone: "UTC",
      timeStyle: "medium",
    }).format(now);
  }
}

const PLACEHOLDER = "--:--:--";

export default function LocalTime({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const [now, setNow] = useState<Date | null>(null);

  // Start the 1s ticker only after mount so the server-rendered placeholder
  // matches the first client render (no hydration mismatch).
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const local = now ? formatLocal(locale, now) : PLACEHOLDER;
  const utc = now ? formatUtc(locale, now) : PLACEHOLDER;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
      <span className="flex items-center gap-1.5 font-medium text-[var(--muted)]">
        <Clock3 className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
        {t("localTime")}
      </span>
      <span className="font-mono tabular-nums">{local}</span>
      <span className="font-mono tabular-nums text-[var(--muted)]">
        UTC {utc}
      </span>
    </div>
  );
}
