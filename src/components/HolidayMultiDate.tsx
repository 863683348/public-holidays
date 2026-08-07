/**
 * Multi-date holiday table (SPEC-002 §3d): one row per date with the UTC-safe
 * weekday. Every date is parsed as UTC midnight (`T00:00:00Z`) so the weekday
 * never drifts by the server's timezone.
 */
export default function HolidayMultiDate({
  dates,
  locale,
  dateHeading,
  weekdayHeading,
}: {
  dates: string[];
  locale: string;
  dateHeading: string;
  weekdayHeading: string;
}) {
  const dateFmt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const weekdayFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  });

  return (
    <table className="w-full max-w-md text-sm">
      <thead>
        <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
          <th scope="col" className="py-2 pe-4 text-start font-medium">
            {dateHeading}
          </th>
          <th scope="col" className="py-2 text-start font-medium">
            {weekdayHeading}
          </th>
        </tr>
      </thead>
      <tbody>
        {dates.map((d) => {
          const utc = new Date(d + "T00:00:00Z");
          return (
            <tr key={d} className="border-b border-[var(--border)] last:border-0">
              <td className="py-2 pe-4">{dateFmt.format(utc)}</td>
              <td className="py-2 text-[var(--muted)]">
                {weekdayFmt.format(utc)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
