/**
 * At-a-glance key-facts grid for the holiday detail page (P1-②).
 *
 * Renders a definition-list grid from a flat `{ label, value }[]` so the page
 * can mix the core facts (date / weekday / scope / type) with the new micro
 * data rows (ISO week / day of year / local time zone / currency). Rows whose
 * value is falsy are skipped — callers pass `null` for time zone / currency
 * when the country has no mapping, and the row is honestly omitted.
 */

export interface HolidayMetaRow {
  label: string;
  value: string;
}

function MetaFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

export default function HolidayMetaRows({ rows }: { rows: HolidayMetaRow[] }) {
  const visible = rows.filter((r) => r.value.length > 0);
  if (visible.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {visible.map((row) => (
        <MetaFact key={row.label} label={row.label} value={row.value} />
      ))}
    </dl>
  );
}
