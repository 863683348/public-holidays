"use client";

import { useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Default open strategy: true=all open (recommended, SEO), false=all closed, number[]=specific indexes open. */
  defaultOpen?: boolean | number[];
  /** Question heading level: h2 when no outer heading, h3 when a parent already has an h2. */
  headingLevel?: "h2" | "h3";
  className?: string;
}

/**
 * Unified FAQ accordion (WAI-ARIA accordion pattern).
 *
 * Behavior: independent multi-open accordion, default fully expanded so the FAQ
 * copy is present in the SSR HTML for search engines — the visible text and the
 * FAQPage JSON-LD share the same `items` array and never drift.
 *
 * - Keyboard: Tab moves between triggers, Enter/Space toggles (native),
 *   ArrowUp/Down/Home/End move focus between triggers (progressive enhancement).
 * - A11y: `aria-expanded`/`aria-controls` on the trigger, `role="region"` +
 *   `aria-labelledby` on the panel, collapsed panels are `inert` so their
 *   content is neither announced nor focusable.
 * - Motion: 150ms grid-template-rows height transition + 180° chevron rotate;
 *   both disabled under `prefers-reduced-motion` via `motion-reduce:transition-none`.
 */
export default function FaqAccordion({
  items,
  defaultOpen = true,
  headingLevel = "h3",
  className = "",
}: FaqAccordionProps) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => {
    if (Array.isArray(defaultOpen)) return new Set(defaultOpen);
    if (defaultOpen) return new Set(items.map((_, i) => i));
    return new Set();
  });

  if (items.length === 0) return null;

  const Heading = headingLevel;

  function toggle(index: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function onTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let target = -1;
    if (event.key === "ArrowDown") target = index + 1;
    else if (event.key === "ArrowUp") target = index - 1;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = items.length - 1;
    if (target >= 0 && target < items.length) {
      event.preventDefault();
      document.getElementById(`faq-trigger-${target}`)?.focus();
    }
  }

  return (
    <div className={className}>
      {items.map((item, index) => {
        const open = openSet.has(index);
        const triggerId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
          <div
            key={index}
            className="border-b border-[var(--border)] last:border-0"
          >
            <Heading className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-md py-3 text-start font-medium transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/30"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden
                  className={`shrink-0 text-[var(--muted)] transition-transform duration-150 motion-reduce:transition-none ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!open}
              className={`grid transition-[grid-template-rows] duration-150 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-3 text-sm leading-relaxed text-[var(--muted)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
