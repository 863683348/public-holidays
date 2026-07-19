import { useTranslations } from "next-intl";
import type { LongWeekend } from "@/lib/longWeekend";

function fmtRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  const s = new Date(`${start}T00:00:00Z`).toLocaleDateString("en-US", opts);
  const e = new Date(`${end}T00:00:00Z`).toLocaleDateString("en-US", opts);
  return start === end ? s : `${s} – ${e}`;
}

export default function LongWeekendList({
  items,
}: {
  items: LongWeekend[];
}) {
  const t = useTranslations("longWeekend");

  if (items.length === 0) {
    return <p className="text-[var(--muted)]">{t("none")}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((lw, i) => (
        <li
          key={`${lw.start}-${i}`}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3"
        >
          <span
            className={[
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              lw.needBridge ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800",
            ].join(" ")}
          >
            {lw.needBridge ? t("bridge") : t("natural")}
          </span>
          <span className="font-medium">{fmtRange(lw.start, lw.end)}</span>
          <span className="text-sm text-[var(--muted)]">
            {lw.days} days
            {lw.needBridge && lw.bridgeDay
              ? ` · ${t("takeGet", { bridge: lw.bridgeDay, days: lw.days })}`
              : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
