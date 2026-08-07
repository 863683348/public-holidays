export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Visible FAQ list for the holiday detail page. Presentational only — the
 * matching FAQPage JSON-LD is emitted by the parent view from the same items
 * array, so the on-page copy and structured data never drift.
 */
export default function HolidayFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="border-b border-[var(--border)] pb-3 last:border-0"
        >
          <h3 className="mb-1 font-medium">{item.question}</h3>
          <p className="text-sm text-[var(--muted)]">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
