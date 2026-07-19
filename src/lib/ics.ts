import type { Holiday } from "./types";

function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Build an iCalendar (RFC 5545) document from a list of holidays.
 * Subscribable by Google / Apple / Outlook Calendar.
 */
export function toICS(holidays: Holiday[], country: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//pubhol//public-holidays//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(`Public Holidays - ${country}`)}`,
  ];

  for (const h of holidays) {
    const dt = h.date.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${h.countryCode}-${dt}@pubhol`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dt}`,
      `SUMMARY:${esc(h.name)}`,
      `DESCRIPTION:${esc(h.localName)}`,
      "TRANSP:OPAQUE",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
