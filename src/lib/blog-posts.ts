import type { BlogPost } from "./types";

/**
 * Blog post data store.
 * In production, replace with MDX files or CMS integration.
 * Each post includes `relatedCountries` for cross-linking to country pages.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How to Calculate Holiday Pay in Germany",
    slug: "how-to-calculate-holiday-pay-in-germany",
    category: "finance",
    author: "Michael Weber",
    publishedDate: "2025-02-20T10:30:00Z",
    lastModified: "2025-02-21T09:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/germany-holiday-pay.jpg",
    excerpt: "Understanding German holiday pay laws for employees.",
    relatedCountries: ["DE"],
    content: `
      <p>Holiday pay in Germany is regulated by the <em>Entgeltfortzahlungsgesetz</em> (Wage Continuation Act). When a public holiday falls on a regular workday, employees are entitled to their regular pay even if they don't work.</p>
      <h2>Key Rules for German Holiday Pay</h2>
      <ul>
        <li><strong>Entitlement:</strong> Employees receive their regular daily wage on public holidays.</li>
        <li><strong>Working on Holidays:</strong> If you work on a public holiday, you're typically entitled to either time off in lieu or premium pay (usually 25-50% extra).</li>
        <li><strong>States May Differ:</strong> Each German state (Bundesland) has its own holiday calendar.</li>
      </ul>
      <h2>Example Calculation</h2>
      <p>If your monthly salary is €3,500 and you work 22 days in a month, your daily rate is approximately €159. If you work on a public holiday, you would receive your regular daily pay plus potentially holiday premium pay.</p>
    `,
  },
  {
    id: 2,
    title: "UK Public Holidays and Bank Days Explained",
    slug: "uk-public-holidays-and-bank-days-explained",
    category: "work",
    author: "Emma Thompson",
    publishedDate: "2025-03-05T09:15:00Z",
    lastModified: "2025-03-06T11:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.jpg",
    excerpt: "A complete guide to UK bank holidays and how they work.",
    relatedCountries: ["GB"],
    content: `
      <p>The United Kingdom has a complex holiday system that varies between England & Wales, Scotland, and Northern Ireland.</p>
      <h2>Bank Holidays by Region</h2>
      <p><strong>England & Wales:</strong> Typically 8 bank holidays per year including New Year's Day, Easter Monday, Early May Bank Holiday, Spring Bank Holiday, Summer Bank Holiday, Christmas Day, and Boxing Day.</p>
      <p><strong>Scotland:</strong> Has additional holidays including January 2nd.</p>
      <p><strong>Northern Ireland:</strong> Includes the Twelfth of July (July 12th).</p>
      <h2>When a Holiday Falls on a Weekend</h2>
      <p>If a bank holiday falls on a weekend, a substitute weekday is usually designated.</p>
    `,
  },
  {
    id: 3,
    title: "Remote Work Holidays in Japan",
    slug: "remote-work-holidays-in-japan",
    category: "work",
    author: "Yuki Tanaka",
    publishedDate: "2025-03-10T11:00:00Z",
    lastModified: "2025-03-11T14:30:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/japan-remote-work.jpg",
    excerpt: "Japan's public holidays for remote workers and digital nomads.",
    relatedCountries: ["JP"],
    content: `
      <p>Japan has one of the most comprehensive public holiday calendars in the world, with 16 national holidays per year.</p>
      <h2>Japan's Key Public Holidays</h2>
      <ul>
        <li>New Year's Day — January 1</li>
        <li>Coming of Age Day — 2nd Monday of January</li>
        <li>Foundation Day — February 11</li>
        <li>Vernal Equinox Day — March 20</li>
        <li>Showa Day — April 29</li>
        <li>Constitutional Memorial Day — May 3</li>
        <li>Greenery Day — May 4</li>
        <li>Children's Day — May 5</li>
        <li>Marine Day — 3rd Monday of July</li>
        <li>Respect for the Aged Day — 3rd Monday of September</li>
        <li>Autumnal Equinox Day — September 23</li>
        <li>Health and Sports Day — 2nd Monday of October</li>
        <li>Culture Day — November 3</li>
        <li>Labour Thanksgiving Day — November 23</li>
        <li>Emperor's Birthday — November 23</li>
      </ul>
    `,
  },
  {
    id: 4,
    title: "Cultural Significance of Chinese New Year",
    slug: "cultural-significance-of-chinese-new-year",
    category: "culture",
    author: "Li Wei",
    publishedDate: "2025-01-25T09:00:00Z",
    lastModified: "2025-01-26T10:15:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/chinese-new-year.jpg",
    excerpt: "The history and traditions behind China's most important holiday.",
    relatedCountries: ["CN", "HK", "TW"],
    content: `
      <p>Chinese New Year, also known as the Spring Festival, is the most important traditional holiday in Chinese culture.</p>
      <h2>Historical Origins</h2>
      <p>The festival originated over 4,000 years ago during the Shang Dynasty. Legend says a monster named Nian would attack villages at the end of each year, but was frightened by loud noises, red color, and fire.</p>
      <h2>Key Traditions</h2>
      <ul>
        <li><strong>Red Envelopes (Hongbao):</strong> Elders give red envelopes containing money as a blessing.</li>
        <li><strong>Family Reunion Dinner:</strong> The most important meal of the year on New Year's Eve.</li>
        <li><strong>Fireworks and Firecrackers:</strong> To scare away evil spirits.</li>
        <li><strong>Lion and Dragon Dances:</strong> Performances for luck and prosperity.</li>
      </ul>
    `,
  },
];

export function getPostData(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getPostsByCountry(countryCode: string): BlogPost[] {
  return BLOG_POSTS.filter(
    (p) => p.relatedCountries.includes(countryCode)
  );
}
