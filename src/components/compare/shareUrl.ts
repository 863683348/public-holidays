// URL building for the /compare dashboard (client-side navigation).
// Keeps the shareable state (c + y + optional view) in one place.

export type CompareViewMode = "auto" | "summary" | "matrix";

/** Locale-relative path for next-intl router.replace (locale prefix added by the router). */
export function comparePath(
  codes: string[],
  year: number,
  view?: Exclude<CompareViewMode, "auto">
): string {
  const params = new URLSearchParams();
  params.set("c", codes.join(","));
  params.set("y", String(year));
  if (view) params.set("view", view);
  return `/compare?${params.toString()}`;
}

/** Split an ISO date into UTC-safe display parts for the current locale. */
export function formatDateParts(date: string, locale: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return {
    weekday: d.toLocaleDateString(locale, {
      weekday: "short",
      timeZone: "UTC",
    }),
    monthDay: d.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  };
}
