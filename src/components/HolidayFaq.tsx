import FaqAccordion from "@/components/FaqAccordion";
import type { FaqItem } from "@/components/FaqAccordion";

export type { FaqItem };

/**
 * Visible FAQ accordion for the holiday detail page. Presentational only — the
 * matching FAQPage JSON-LD is emitted by the parent view from the same items
 * array, so the on-page copy and structured data never drift. Thin wrapper that
 * keeps the existing import surface (`HolidayFaq` + `FaqItem`) stable while
 * delegating markup/interaction/a11y to the unified `FaqAccordion`.
 */
export default function HolidayFaq({ items }: { items: FaqItem[] }) {
  return <FaqAccordion items={items} defaultOpen headingLevel="h3" />;
}
