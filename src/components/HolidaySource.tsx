/**
 * E-E-A-T source block for the holiday detail page (heading + note + optional
 * official source link). Split out of HolidayDetailView to keep it ≤300 lines.
 */
export default function HolidaySource({
  heading,
  note,
  officialSource,
  officialLabel,
}: {
  heading: string;
  note: string;
  officialSource?: string;
  officialLabel: string;
}) {
  return (
    <section className="space-y-1 rounded-lg border border-[var(--border)] p-4 text-sm">
      <h2 className="font-semibold">{heading}</h2>
      <p className="leading-relaxed text-[var(--muted)]">{note}</p>
      {officialSource && (
        <p className="leading-relaxed">
          <span className="text-[var(--muted)]">{officialLabel} </span>
          <a
            href={officialSource}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-brand hover:underline"
          >
            {officialSource}
          </a>
        </p>
      )}
    </section>
  );
}
