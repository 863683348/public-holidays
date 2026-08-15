// Single source of truth for the supported holiday year window.
// Previously duplicated in [year]/page.tsx and YearNav.tsx.

export const MIN_YEAR = 2021;
export const MAX_YEAR = 2035;

/** Returns the year, or null if not an integer inside [MIN_YEAR, MAX_YEAR]. */
export function parseYear(raw: string): number | null {
  const y = Number(raw);
  if (!Number.isInteger(y) || y < MIN_YEAR || y > MAX_YEAR) return null;
  return y;
}
