import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCountry } from "@/lib/countries";
import { articleBreadcrumb, articleStructuredData } from "@/lib/seo";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import AdSlot from "@/components/AdSlot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const t = await getTranslations("blog");

  // In production, fetch actual post data from CMS
  const post = await getPostData(slug, category);

  if (!post) {
    return { title: t("notFound") };
  }

  const title = `${post.title} — ${t("blogSection")}`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${category}/${post.slug}`,
    },
    openGraph: {
      type: "article",
      siteName: "PubHoliday",
      title,
      description,
      url: `${SITE_URL}/${locale}/blog/${category}/${post.slug}`,
      publishedTime: post.publishedDate,
      modifiedTime: post.lastModified,
      section: category,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

// Sample post data — in production, replace with CMS/fetch
async function getPostData(slug: string, category: string) {
  // Simulated data store
  const posts: Record<string, any> = {
    "how-to-calculate-holiday-pay-in-germany": {
      id: 1,
      title: "How to Calculate Holiday Pay in Germany",
      slug: "how-to-calculate-holiday-pay-in-germany",
      category: "finance",
      author: "Michael Weber",
      publishedDate: "2025-02-20T10:30:00Z",
      lastModified: "2025-02-21T09:00:00Z",
      imageUrl: "https://public-holidays.shop/images/blog/germany-holiday-pay.jpg",
      excerpt: "Understanding German holiday pay laws for employees.",
      content: `
        <p>Holiday pay in Germany is regulated by the <em>Entgeltfortzahlungsgesetz</em> (Wage Continuation Act). When a public holiday falls on a regular workday, employees are entitled to their regular pay even if they don't work.</p>

        <h2>Key Rules for German Holiday Pay</h2>
        <ul>
          <li><strong>Entitlement:</strong> Employees receive their regular daily wage on public holidays.</li>
          <li><strong>Working on Holidays:</strong> If you work on a public holiday, you're typically entitled to either time off in lieu or premium pay (usually 25-50% extra).</li>
          <li><strong>Countries with 10-13 Public Holidays:</strong> Each German state (Bundesland) has its own holiday calendar.</li>
        </ul>

        <h2>Example Calculation</h2>
        <p>If your monthly salary is €3,500 and you work 22 days in a month, your daily rate is approximately €159. If you work on a public holiday (e.g., German Unity Day on October 3rd), you would receive your regular daily pay plus potentially holiday premium pay.</p>

        <p><strong>Note:</strong> Collective bargaining agreements and individual employment contracts may modify these rules. Always check your specific terms.</p>
      `,
    },
    "uk-public-holidays-and-bank-days-explained": {
      id: 2,
      title: "UK Public Holidays and Bank Days Explained",
      slug: "uk-public-holidays-and-bank-days-explained",
      category: "work",
      author: "Emma Thompson",
      publishedDate: "2025-03-05T09:15:00Z",
      lastModified: "2025-03-06T11:00:00Z",
      imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.jpg",
      excerpt: "A complete guide to UK bank holidays and how they work.",
      content: `
        <p>The United Kingdom has a complex holiday system that varies between England & Wales, Scotland, and Northern Ireland. Understanding these differences is crucial for employers and employees alike.</p>

        <h2>Bank Holidays by Region</h2>
        <p><strong>England & Wales:</strong> Typically 8 bank holidays per year, including New Year's Day, Easter Monday, Early May Bank Holiday, Spring Bank Holiday, Summer Bank Holiday, Christmas Day, and Boxing Day.</p>
        <p><strong>Scotland:</strong> Has additional holidays including New Year's Day holiday (January 2nd) and sometimes different dates for May and summer holidays.</p>
        <p><strong>Northern Ireland:</strong> Includes the Twelfth of July (July 12th) as a unique holiday, commemorating the Battle of the Boyne.</p>

        <h2>When a Holiday Falls on a Weekend</h2>
        <p>If a bank holiday falls on a weekend, a "substitute weekday" is usually designated. For example, if Christmas Day falls on a Saturday, Boxing Day (December 26th) becomes the holiday instead.</p>

        <h2>Employee Rights</h2>
        <p>Unlike some countries, there is no statutory right to paid time off on bank holidays in the UK. Whether you get the day off or extra pay depends on your employment contract. Many employers give the day off with pay, or offer premium rates for working on bank holidays.</p>
      `,
    },
    "remote-work-holidays-in-japan": {
      id: 3,
      title: "Remote Work Holidays in Japan",
      slug: "remote-work-holidays-in-japan",
      category: "work",
      author: "Yuki Tanaka",
      publishedDate: "2025-03-10T11:00:00Z",
      lastModified: "2025-03-11T14:30:00Z",
      imageUrl: "https://public-holidays.shop/images/blog/japan-remote-work.jpg",
      excerpt: "Japan's public holidays for remote workers and digital nomads.",
      content: `
        <p>Japan has one of the most comprehensive public holiday calendars in the world, with 16 national holidays per year. For remote workers and digital nomads, these holidays present unique opportunities for work-life balance.</p>

        <h2>Japan's 2025 Public Holidays</h2>
        <ul>
          <li>New Year's Day: January 1</li>
          <li>Coming of Age Day: January 13 (2nd Monday of January)</li>
          <li>Foundation Day: February 11</li>
          <li>Vernal Equinox Day: March 20</li>
          <li>Showa Day: April 29</li>
          <li>Constitutional Memorial Day: May 3</li>
          <li>Greenery Day: May 4</li>
          <li>Children's Day: May 5</li>
          <li>Marine Day: July 21 (3rd Monday of July)</li>
          <li>Respect for the Aged Day: September 15 (3rd Monday of September)</li>
          <li>Autumnal Equinox Day: September 23</li>
          <li>Health and Sports Day: October 13 (2nd Monday of October)</li>
          <li>Culture Day: November 3</li>
          <li>Labour Thanksgiving Day: November 23</li>
          <li>Emperor's Birthday: November 23</li>
        </ul>

        <h2>Remote Work Considerations</h2>
        <p>When working remotely from Japan during public holidays, be aware that many businesses and government offices close. This can affect service availability, including postal services, banks, and some online platforms.</p>

        <p><em>Note:</em> The above information is for general reference. Always verify with official sources for the most current holiday dates.</p>
      `,
    },
    "cultural-significance-of-chinese-new-year": {
      id: 4,
      title: "Cultural Significance of Chinese New Year",
      slug: "cultural-significance-of-chinese-new-year",
      category: "culture",
      author: "Li Wei",
      publishedDate: "2025-01-25T09:00:00Z",
      lastModified: "2025-01-26T10:15:00Z",
      imageUrl: "https://public-holidays.shop/images/blog/chinese-new-year.jpg",
      excerpt: "The history and traditions behind China's most important holiday.",
      content: `
        <p>Chinese New Year, also known as the Spring Festival, is the most important traditional holiday in Chinese culture. It marks the beginning of the lunar new year and is celebrated with a week-long holiday across China and many Asian communities worldwide.</p>

        <h2>Historical Origins</h2>
        <p>The festival originated over 4,000 years ago during the Shang Dynasty. Legend says a monster named "Nian" would attack villages at the end of each year, but was frightened by loud noises, red color, and fire. These traditions continue today in the form of firecrackers, red envelopes, and dragon dances.</p>

        <h2>Key Traditions</h2>
        <ul>
          <li><strong>Red Envelopes (Hongbao):</strong> Elders give red envelopes containing money to children and unmarried adults as a blessing for the new year.</li>
          <li><strong>Family Reunion Dinner:</strong> The most important meal of the year, typically held on New Year's Eve.</li>
          <li><strong>Fireworks and Firecrackers:</strong> Used to scare away evil spirits and welcome good fortune.</li>
          <li><strong>Lion and Dragon Dances:</strong> Performances in streets and businesses to bring luck and prosperity.</li>
        </ul>

        <h2>Modern Celebrations</h2>
        <p>Today, Chinese New Year is a statutory holiday in China, Taiwan, Hong Kong, Macau, and many other countries with significant Chinese populations. The festival typically spans 15 days, culminating in the Lantern Festival.</p>
      `,
    },
  };

  return posts[slug] || null;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const t = await getTranslations("blog");

  const post = await getPostData(slug, category);

  if (!post) {
    notFound();
  }

  const localeStr = locale || "en";

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Link href={`/${localeStr}`} className="text-brand hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${localeStr}/blog`} className="text-brand hover:underline">
            Blog
          </Link>
          <span>/</span>
          <span>{category}</span>
          <span>/</span>
          <span className="text-[var(--foreground)]">{post.title}</span>
        </div>
      </nav>

      {/* Article Header */}
      <article>
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString(localeStr, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>Category: {post.category}</span>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-lg shadow-lg mb-6"
              loading="eager"
            />
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none text-[var(--foreground)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Options */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">{t("shareThis")}</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(
                  `${SITE_URL}/${localeStr}/blog/${category}/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `${SITE_URL}/${localeStr}/blog/${category}/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-800 text-white rounded-sm hover:bg-blue-900 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://api.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${SITE_URL}/${localeStr}/blog/${category}/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-sm hover:bg-blue-800 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleStructuredData(
              post.title,
              post.excerpt,
              post.author,
              post.publishedDate,
              post.lastModified,
              category,
              post.imageUrl || ""
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleBreadcrumb(category, post.title)
          ),
        }}
      />

      <AdSlot />
      <SubscribeButton
        country=""
        label={t("subscribeNewsletter")}
        hint={t("subscribeNewsletterHint")}
      />
    </div>
  );
}
