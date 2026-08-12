import type { Metadata } from "next";
import {
  Building2,
  CalendarDays,
  Check,
  Globe,
  GraduationCap,
  Plane,
  X,
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { Link } from "@/i18n/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// HTML snippet builders — machine-consumed by third-party sites, so they stay
// English by design; only the live country count is interpolated at render time
// (never hardcode 46/110 — always COUNTRIES.length).
const BADGE_HTML = () =>
  '<a href="https://public-holidays.shop" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 16px;background:#2563eb;color:#fff;border-radius:4px;text-decoration:none;font-size:14px;">Public Holidays 2027</a>';

const TEXT_LINK_HTML = (count: number) =>
  `<a href="https://public-holidays.shop" target="_blank" rel="noopener noreferrer">Public Holidays - ${count} Countries Calendar</a>`;

const FOOTER_LINK_HTML =
  'Holiday data provided by <a href="https://public-holidays.shop" target="_blank" rel="noopener noreferrer">Public Holidays</a>';

const ATTRIBUTION_HTML = (count: number) =>
  `Public holiday dates sourced from <a href="https://public-holidays.shop" target="_blank" rel="noopener noreferrer">Public Holidays</a> \u2014 the free global holiday calendar covering ${count} countries and 11 languages.`;

const escapeHtml = (html: string) => html.replace(/</g, "&lt;").replace(/>/g, "&gt;");


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = COUNTRIES.length;
  return {
    title: "Link to Us - Public Holidays Resource",
    description: `Embed public holiday data on your site. Free calendar widgets, data attribution, and link badges for ${count} countries.`,
    alternates: { canonical: `${SITE_URL}/${locale}/link-to-us` },
    openGraph: {
      title: "Link to Us - Public Holidays",
      description: "Free public holiday data widgets and embed codes for your website.",
      url: `${SITE_URL}/${locale}/link-to-us`,
    },
  };
}

export default async function LinkToUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const count = COUNTRIES.length;

  const popularCountries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CN", name: "China" },
    { code: "JP", name: "Japan" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
    { code: "KR", name: "South Korea" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "SG", name: "Singapore" },
  ];

  const sectionIcon = "h-5 w-5 shrink-0 text-brand";

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Link to Us</h1>
        <p className="text-lg text-[var(--muted)] mb-6">
          Use our free public holiday data on your website. We provide embed widgets, data attribution snippets,
          and link badges for blogs, HR portals, travel sites, and more.
        </p>
      </section>

      {/* Why Link */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Why Link to Public Holidays?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{count} Countries</h3>
            <p className="text-sm text-[var(--muted)]">
              Comprehensive public holiday data covering all major global markets, updated annually.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">11 Languages</h3>
            <p className="text-sm text-[var(--muted)]">
              Fully localized in Chinese, English, Japanese, Korean, Spanish, German, French, Portuguese, Italian, Russian, and Arabic.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Free &amp; Always Updated</h3>
            <p className="text-sm text-[var(--muted)]">
              Data sourced from the open Nager.Date API with automatic updates. No API key required.
            </p>
          </div>
        </div>
      </section>

      {/* Embed Badge */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Link Badge (HTML)</h2>
        <p className="text-[var(--muted)] mb-4">
          Add this badge to your blog sidebar, resource page, or footer to link to our holiday data:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm" dangerouslySetInnerHTML={{ __html: escapeHtml(BADGE_HTML()) }} />
        </div>

        <div className="mt-4 p-4 border rounded-lg">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <a
            href="https://public-holidays.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-sm text-sm no-underline hover:opacity-90"
          >
            <CalendarDays size={16} strokeWidth={1.75} aria-hidden />
            Public Holidays 2027
          </a>
        </div>
      </section>

      {/* Text Link */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Text Link (HTML)</h2>
        <p className="text-[var(--muted)] mb-4">
          For a simple text-based attribution link:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm" dangerouslySetInnerHTML={{ __html: escapeHtml(TEXT_LINK_HTML(count)) }} />
        </div>
      </section>

      {/* Footer Link */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Footer Link</h2>
        <p className="text-[var(--muted)] mb-4">
          Add this to your website footer for a subtle attribution:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm" dangerouslySetInnerHTML={{ __html: escapeHtml(FOOTER_LINK_HTML) }} />
        </div>
      </section>

      {/* Data Attribution */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Data Attribution for Blog Posts</h2>
        <p className="text-[var(--muted)] mb-4">
          If you write about public holidays, long weekends, or travel planning, cite our data with this attribution:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm" dangerouslySetInnerHTML={{ __html: escapeHtml(ATTRIBUTION_HTML(count)) }} />
        </div>
      </section>

      {/* Best for these site types */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ideal for These Types of Sites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Plane size={18} strokeWidth={1.75} aria-hidden className={sectionIcon} />
              Travel Blogs
            </h3>
            <p className="text-sm text-[var(--muted)]">Reference holiday dates in travel itineraries and destination guides.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Building2 size={18} strokeWidth={1.75} aria-hidden className={sectionIcon} />
              HR &amp; Remote Work Portals
            </h3>
            <p className="text-sm text-[var(--muted)]">Help global teams track holidays across different countries.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Globe size={18} strokeWidth={1.75} aria-hidden className={sectionIcon} />
              Business Directories
            </h3>
            <p className="text-sm text-[var(--muted)]">Include holiday information for international business planning.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <GraduationCap size={18} strokeWidth={1.75} aria-hidden className={sectionIcon} />
              Educational Resources
            </h3>
            <p className="text-sm text-[var(--muted)]">Teach about global cultural holidays and their significance.</p>
          </div>
        </div>
      </section>

      {/* Country Quick Links */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Country Holiday Pages</h2>
        <p className="text-[var(--muted)] mb-4">
          Link directly to specific country holiday pages:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {popularCountries.map((c) => (
            <Link
              key={c.code}
              href={`/${c.code}`}
              className="px-3 py-2 bg-[var(--brand)]/10 rounded-sm text-sm hover:bg-[var(--brand)]/20 transition-colors text-center"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Linking Guidelines</h2>
        <ul className="space-y-3 text-[var(--muted)]">
          <li className="flex items-start gap-2">
            <Check size={16} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-green-600 dark:text-green-400" />
            <span>You may use our badges and text links freely on any website.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-green-600 dark:text-green-400" />
            <span>You may reference our holiday data with proper attribution.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-green-600 dark:text-green-400" />
            <span>
              All links should use <code>rel=&quot;noopener noreferrer&quot;</code> for security.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <X size={16} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-red-600 dark:text-red-400" />
            <span>Do not claim our data as your own without attribution.</span>
          </li>
          <li className="flex items-start gap-2">
            <X size={16} strokeWidth={2} aria-hidden className="mt-1 shrink-0 text-red-600 dark:text-red-400" />
            <span>Do not use our badges or links in spam or malicious contexts.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
