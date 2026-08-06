import type { BlogPost } from "./types";

/**
 * Blog post data store with multilingual support.
 * Each post includes a `locale` field (defaults to "en").
 * Chinese versions use locale: "zh" with the same slug.
 */

export const BLOG_POSTS: BlogPost[] = [
  // ========================================================================
  // EXISTING ENGLISH POSTS (preserved with locale: "en")
  // ========================================================================
  {
    id: 1,
    title: "How to Calculate Holiday Pay in Germany",
    slug: "how-to-calculate-holiday-pay-in-germany",
    category: "finance",
    author: "Michael Weber",
    publishedDate: "2025-02-20T10:30:00Z",
    lastModified: "2025-02-21T09:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/germany-holiday-pay.svg",
    excerpt: "Understanding German holiday pay laws for employees.",
    relatedCountries: ["DE"],
    locale: "en",
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
      <h2>Germany's 2027 Public Holidays</h2>
      <p>Germany has <strong>9 nationwide public holidays</strong> plus additional state-specific holidays. Key dates for 2027 include: New Year's Day (Jan 1), Good Friday (Mar 26), Easter Monday (Mar 29), Labour Day (May 1), Ascension Day (May 6), Whit Monday (May 17), German Unity Day (Oct 3), Christmas Day (Dec 25), and Boxing Day (Dec 26). Bavaria and other states add up to 13 total holidays with Epiphany (Jan 6), Corpus Christi (Jun 3), and Assumption Day (Aug 15).</p>
      <p>For the full German holiday calendar, visit our <a href="https://public-holidays.shop/en/DE">Germany holidays page</a>.</p>
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
    imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.svg",
    excerpt: "A complete guide to UK bank holidays and how they work.",
    relatedCountries: ["GB"],
    locale: "en",
    content: `
      <p>The United Kingdom has a complex holiday system that varies between England & Wales, Scotland, and Northern Ireland.</p>
      <h2>Bank Holidays by Region</h2>
      <p><strong>England & Wales:</strong> Typically 8 bank holidays per year including New Year's Day, Easter Monday, Early May Bank Holiday, Spring Bank Holiday, Summer Bank Holiday, Christmas Day, and Boxing Day.</p>
      <p><strong>Scotland:</strong> Has additional holidays including January 2nd.</p>
      <p><strong>Northern Ireland:</strong> Includes the Twelfth of July (July 12th).</p>
      <h2>When a Holiday Falls on a Weekend</h2>
      <p>If a bank holiday falls on a weekend, a substitute weekday (known as a "bank holiday in lieu") is usually designated. In 2027, Christmas Day falls on a Saturday, so the substitute day will be Monday December 27.</p>
      <h2>UK Holiday Allowance</h2>
      <p>Full-time UK workers are entitled to <strong>28 days</strong> of paid annual leave (including bank holidays). This is one of the lowest statutory allowances in Europe — Germany offers 30 days while France offers 25 days plus 11 public holidays.</p>
      <p>View the full list on our <a href="https://public-holidays.shop/en/GB">UK bank holidays page</a>.</p>
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
    imageUrl: "https://public-holidays.shop/images/blog/japan-remote-work.svg",
    excerpt: "Japan's public holidays for remote workers and digital nomads.",
    relatedCountries: ["JP"],
    locale: "en",
    content: `
      <p>Japan has one of the most comprehensive public holiday calendars in the world, with <strong>16 national holidays</strong> per year — the most among developed nations.</p>
      <h2>Japan's 2027 Public Holidays</h2>
      <ul>
        <li>New Year's Day — January 1 (Saturday)</li>
        <li>Coming of Age Day — January 11 (2nd Monday)</li>
        <li>Foundation Day — February 11 (Thursday)</li>
        <li>National Foundation Day observed — February 12 (Friday) *substitute holiday</li>
        <li>Vernal Equinox Day — March 21 (Sunday)</li>
        <li>Showa Day — April 29 (Thursday)</li>
        <li>Constitutional Memorial Day — May 3 (Monday)</li>
        <li>Greenery Day — May 4 (Tuesday)</li>
        <li>Children's Day — May 5 (Wednesday)</li>
        <li>Marine Day — July 19 (3rd Monday)</li>
        <li>Respect for the Aged Day — September 20 (3rd Monday)</li>
        <li>Autumnal Equinox Day — September 23 (Thursday)</li>
        <li>Health and Sports Day — October 11 (2nd Monday)</li>
        <li>Culture Day — November 3 (Wednesday)</li>
        <li>Labour Thanksgiving Day — November 23 (Tuesday)</li>
        <li>Emperor's Birthday — February 23 (Tuesday)</li>
      </ul>
      <h2>Golden Week: Japan's Best Holiday Cluster</h2>
      <p>From April 29 to May 5, Japan celebrates <strong>Golden Week</strong> — a concentrated cluster of 4 national holidays within 7 days. In 2027, this creates a magnificent 7-day holiday stretch. Remote workers should plan around this period as businesses across Japan shut down.</p>
      <p>For exact dates, visit our <a href="https://public-holidays.shop/en/JP">Japan holidays page</a>.</p>
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
    imageUrl: "https://public-holidays.shop/images/blog/chinese-new-year.svg",
    excerpt: "The history and traditions behind China's most important holiday.",
    relatedCountries: ["CN", "HK", "TW"],
    locale: "en",
    content: `
      <p>Chinese New Year, also known as the Spring Festival, is the most important traditional holiday in Chinese culture. In 2027, Chinese New Year falls on <strong>February 6</strong> (Year of the Goat).</p>
      <h2>Historical Origins</h2>
      <p>The festival originated over 4,000 years ago during the Shang Dynasty. Legend says a monster named Nian would attack villages at the end of each year, but was frightened by loud noises, red color, and fire.</p>
      <h2>Key Traditions</h2>
      <ul>
        <li><strong>Red Envelopes (Hongbao):</strong> Elders give red envelopes containing money as a blessing.</li>
        <li><strong>Family Reunion Dinner:</strong> The most important meal of the year on New Year's Eve.</li>
        <li><strong>Fireworks and Firecrackers:</strong> To scare away evil spirits.</li>
        <li><strong>Lion and Dragon Dances:</strong> Performances for luck and prosperity.</li>
      </ul>
      <h2>Public Holiday Duration</h2>
      <p>In China, the official public holiday for Spring Festival is <strong>7 days</strong> (including the weekend before and after). However, many businesses and factories close for 2-3 weeks. Hong Kong observes 4 days and Taiwan 4 days around the Lunar New Year.</p>
      <p>Check exact dates on our <a href="https://public-holidays.shop/en/CN">China holidays page</a>.</p>
    `,
  },

  // ========================================================================
  // NEW DATA-DRIVEN ENGLISH POSTS (Phase 1.1)
  // ========================================================================

  // --- POST 5: Global Public Holidays 2027 Complete Calendar ---
  {
    id: 5,
    title: "Global Public Holidays 2027: The Complete Calendar for 46 Countries",
    slug: "global-public-holidays-2027-complete-calendar",
    category: "data",
    author: "PubHoliday Research Team",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/global-holidays-2027-calendar.svg",
    excerpt: "Comprehensive 2027 public holiday calendar covering all 46 countries. Plan your global business, travel, and remote work schedule with confidence.",
    relatedCountries: ["US", "GB", "CN", "JP", "DE", "FR", "AU", "CA", "IN", "BR", "SG", "KR"],
    locale: "en",
    content: `
      <p>Planning international travel, managing a global team, or scheduling cross-border business in 2027? We've compiled the complete public holiday calendar for all <strong>46 countries</strong> available on Public Holidays. This is your go-to reference for the entire year.</p>

      <h2>Asia Pacific 2027 Holidays</h2>
      <h3>China (CN) — 16 Public Holidays in 2027</h3>
      <p>China has the most concentrated holiday structure. Key dates: New Year (Jan 1), Chinese New Year (Feb 6-12), Qingming Festival (Apr 5), Labour Day (May 1), Dragon Boat Festival (Jun 9), Mid-Autumn Festival (Sep 15), National Day (Oct 1-7). The <strong>7-day National Day Golden Week</strong> and <strong>7-day Spring Festival</strong> are China's two major travel rushes.</p>

      <h3>Japan (JP) — 16 National Holidays</h3>
      <p>Japan's <strong>Golden Week</strong> (Apr 29-May 5) is the biggest holiday cluster. See our detailed breakdown in the Japan remote work article.</p>

      <h3>India (IN) — 16+ Holidays</h3>
      <p>India has 3 national holidays (Republic Day Jan 26, Independence Day Aug 15, Gandhi Jayanti Oct 2) plus state-specific festivals. Major 2027 dates: Diwali (Oct 24), Holi (Mar 13), Dussehra (Oct 9), Eid al-Fitr (approx. Mar 1, subject to moon sighting).</p>

      <h3>South Korea (KR) — 13 Holidays</h3>
      <p>Key dates: Seollal (Lunar New Year, Feb 6-8), Independence Movement Day (Mar 1), Children's Day (May 5), Buddha's Birthday (May 11), Chuseok (Sep 15-17), Hangul Day (Oct 9), Christmas (Dec 25).</p>

      <h2>Europe 2027 Holidays</h2>
      <h3>United Kingdom (GB) — 8 Bank Holidays</h3>
      <p>New Year's Day (Jan 1), Good Friday (Mar 26), Easter Monday (Mar 29), Early May Bank Holiday (May 3), Spring Bank Holiday (May 31), Summer Bank Holiday (Aug 30), Christmas Day (Dec 25 substitute Dec 27), Boxing Day (Dec 26 substitute Dec 28).</p>

      <h3>Germany (DE) — 9-13 Holidays (by state)</h3>
      <p>9 nationwide + optional state holidays. German Unity Day (Oct 3) is the only federal holiday. See our German holiday pay article for details.</p>

      <h3>France (FR) — 11 Holidays</h3>
      <p>New Year's Day (Jan 1), Easter Monday (Mar 29), Labour Day (May 1), Victory 1945 (May 8), Ascension Day (May 6), Whit Monday (May 17), Bastille Day (Jul 14), Assumption Day (Aug 15), All Saints' Day (Nov 1), Armistice Day (Nov 11), Christmas Day (Dec 25).</p>

      <h3>Italy (IT) — 11 Holidays</h3>
      <p>Similar to France plus Epiphany (Jan 6), Liberation Day (Apr 25), Republic Day (Jun 2), Immaculate Conception (Dec 8).</p>

      <h3>Spain (ES) — 12 Holidays</h3>
      <p>Key additions: Epiphany (Jan 6), Constitution Day (Dec 6), Immaculate Conception (Dec 8) — plus 2 regional holidays per autonomous community.</p>

      <h3>Netherlands (NL) — 10 Holidays</h3>
      <p>King's Day (Apr 27) is the biggest celebration. Liberation Day (May 5) is a public holiday every 5 years.</p>

      <h3>Nordic Countries</h3>
      <p><strong>Sweden</strong> (11): Epiphany (Jan 6), Walpurgis Night (Apr 30), National Day (Jun 6), Midsummer (Jun 25-26). <strong>Denmark</strong> (9): Store Bededag (Apr 23), Constitution Day (Jun 5). <strong>Norway</strong> (10): Constitution Day (May 17) — a massive celebration. <strong>Finland</strong> (10): Vappu (May 1), Midsummer (Jun 25-26), Independence Day (Dec 6).</p>

      <h2>North America 2027 Holidays</h2>
      <h3>United States (US) — 11 Federal Holidays</h3>
      <p>New Year's Day (Jan 1), MLK Day (Jan 18), Presidents' Day (Feb 15), Memorial Day (May 31), Independence Day (Jul 4, Sunday — observed Jul 5), Labor Day (Sep 6), Columbus Day (Oct 11), Veterans Day (Nov 11), Thanksgiving (Nov 25), Christmas Day (Dec 25).</p>

      <h3>Canada (CA) — 8-10 Holidays</h3>
      <p>Victoria Day (May 24), Canada Day (Jul 1), Labour Day (Sep 6), Thanksgiving (Oct 11), Remembrance Day (Nov 11). Provincial holidays vary (e.g., Family Day in Feb, St. Jean Baptiste in QC).</p>

      <h2>Latin America 2027 Holidays</h2>
      <h3>Brazil (BR) — 12 National Holidays</h3>
      <p>Carnival (Feb 9-10, half-day), Good Friday (Mar 26), Tiradentes (Apr 21), Labour Day (May 1), Corpus Christi (Jun 3), Independence Day (Sep 7), Our Lady of Aparecida (Oct 12), All Souls' Day (Nov 2), Proclamation of Republic (Nov 15), Christmas (Dec 25).</p>

      <h3>Mexico (MX) — 7-8 Holidays</h3>
      <p>Constitution Day (Feb 1), Benito Juárez's Birthday (Mar 15), Good Friday (Mar 26), Labour Day (May 1), Independence Day (Sep 16), Revolution Day (Nov 15), Christmas (Dec 25).</p>

      <h2>Middle East & Africa 2027 Holidays</h2>
      <h3>UAE (AE) — Variable (Islamic calendar)</h3>
      <p>Key 2027 dates: New Year's Day (Jan 1), Eid al-Fitr (approx. Mar 1-4), Arafat Day (approx. May 3), Eid al-Adha (approx. May 4-6), Islamic New Year (approx. Aug 23), National Day (Dec 2-3). Islamic holidays shift ~11 days earlier each Gregorian year.</p>

      <h3>Saudi Arabia (SA) — Similar Islamic holidays</h3>
      <p>Saudi Founding Day (Feb 22), Saudi National Day (Sep 23), plus the same Islamic holidays as UAE.</p>

      <h3>South Africa (ZA) — 12 Holidays</h3>
      <p>Human Rights Day (Mar 21), Good Friday (Mar 26), Family Day (Mar 29), Freedom Day (Apr 27), Workers' Day (May 1), Youth Day (Jun 16), Women's Day (Aug 9), Heritage Day (Sep 24), Day of Reconciliation (Dec 16), Christmas & Day of Goodwill (Dec 25-26).</p>

      <h2>Australia & Oceania 2027 Holidays</h2>
      <h3>Australia (AU) — 7-9 Holidays</h3>
      <p>National: New Year's Day (Jan 1), Australia Day (Jan 26), Good Friday (Mar 26), Easter Monday (Mar 29), Anzac Day (Apr 25), Christmas (Dec 25), Boxing Day (Dec 26). State-specific: Labour Day varies by state/territory.</p>

      <h3>New Zealand (NZ) — 9-10 Holidays</h3>
      <p>Waitangi Day (Feb 6), Good Friday (Mar 26), Easter Monday (Mar 29), Anzac Day (Apr 25), Queen's Birthday (Jun 7), Matariki (Jun 25), Labour Day (Oct 25), Christmas (Dec 25), Boxing Day (Dec 26).</p>

      <h2>How to Use This Calendar</h2>
      <p>All dates are sourced from the <a href="https://date.nager.at" rel="nofollow">Nager.Date API</a> and verified against local government sources where possible. For the most up-to-date information, visit:</p>
      <ul>
        <li><a href="https://public-holidays.shop">Public Holidays — Full interactive calendar with 46 countries</a></li>
        <li>Subscribe to any country's holiday calendar via ICS feed (Google Calendar, Apple Calendar, Outlook)</li>
        <li>Use our <strong>Long Weekend Planner</strong> to find optimal bridge-day opportunities</li>
      </ul>
      <p><em>Note: Islamic (Hijri) holidays are approximate as they depend on moon sighting. Dates provided are best estimates based on astronomical calculations.</em></p>
    `,
    faq: [
      {
        question: "What are the public holiday dates for 2025 and 2026?",
        answer:
          "This calendar focuses on 2027, but the same 46-country dataset covers 2025 and 2026 as well. Fixed-date holidays (New Year, Christmas) barely move; movable ones (Easter, Islamic Hijri holidays) shift each year. Use the year switcher on any country page to view 2025, 2026, or 2027 dates.",
      },
      {
        question: "What are public dates?",
        answer:
          "\"Public dates\" means the official public holiday dates observed in each country. We track all 46 countries with verified dates, ICS calendar subscriptions, and long-weekend planning so you always know the next public date at a glance.",
      },
      {
        question: "¿Cuáles fueron los festivos en 2019?",
        answer:
          "Los festivos de 2019 variaron por país, pero la mayoría de las fechas fijas (Año Nuevo, Navidad, Día del Trabajo) se repiten cada año. Para ver los festivos de cualquier año, usa el selector de año en la página de cada país de nuestro calendario.",
      },
      {
        question: "What were the public holidays like in 2018?",
        answer:
          "Public holidays in 2018 followed the same fixed-date pattern as today — New Year's Day, Christmas, Labour Day, and each country's national days. Movable holidays like Easter fell earlier in 2018. You can explore any past year, including 2018, using the year switcher on each country page.",
      },
      {
        question: "Which European countries have the most public holidays?",
        answer:
          "Among European countries, Austria, Belgium, France, Germany, Greece, Italy, Poland, Portugal, Spain and Switzerland each observe around 11 public holidays, while the Nordics and the UK range from 8-11. Southern Europe — France, Spain, Italy and Greece — leads the continent for public holidays in Europe.",
      },
    ],
  },

  // --- POST 6: Countries with Most Public Holidays Ranking ---
  {
    id: 6,
    title: "Which Countries Have the Most Public Holidays in 2027? A Global Ranking",
    slug: "countries-most-public-holidays-2027-ranking",
    category: "data",
    author: "PubHoliday Research Team",
    publishedDate: "2026-07-28T09:00:00Z",
    lastModified: "2026-07-28T09:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/public-holidays-ranking-2027.svg",
    excerpt: "Ranking of 46 countries by number of public holidays in 2027. See which countries offer the most paid time off and how holiday cultures differ worldwide.",
    relatedCountries: ["US", "GB", "CN", "JP", "IN", "TH", "PH", "DE", "FR", "BR", "MX", "AE"],
    locale: "en",
    content: `
      <p>How many public holidays does your country have in 2027? We've analyzed all <strong>46 countries</strong> available on Public Holidays to bring you the definitive ranking. The results may surprise you.</p>

      <h2>The 2027 Global Ranking</h2>

      <h3>🥇 Tier 1: 15-18 Holidays (The World's Most Generous)</h3>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Rank</th>
            <th class="border p-2">Country</th>
            <th class="border p-2">Code</th>
            <th class="border p-2">Est. Holidays</th>
            <th class="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">1</td><td class="border p-2">Philippines</td><td class="border p-2">PH</td><td class="border p-2">~18</td><td class="border p-2">Regular + special non-working days</td></tr>
          <tr><td class="border p-2">2</td><td class="border p-2">Japan</td><td class="border p-2">JP</td><td class="border p-2">16</td><td class="border p-2">Substitute holidays when on Sunday</td></tr>
          <tr><td class="border p-2">3</td><td class="border p-2">China</td><td class="border p-2">CN</td><td class="border p-2">16</td><td class="border p-2">Including adjusted weekends</td></tr>
          <tr><td class="border p-2">4</td><td class="border p-2">India</td><td class="border p-2">IN</td><td class="border p-2">16</td><td class="border p-2">3 national + variable state holidays</td></tr>
          <tr><td class="border p-2">5</td><td class="border p-2">Indonesia</td><td class="border p-2">ID</td><td class="border p-2">~16</td><td class="border p-2">Islamic + national holidays</td></tr>
          <tr><td class="border p-2">6</td><td class="border p-2">Egypt</td><td class="border p-2">EG</td><td class="border p-2">~16</td><td class="border p-2">Islamic + Coptic + national holidays</td></tr>
          <tr><td class="border p-2">7</td><td class="border p-2">Thailand</td><td class="border p-2">TH</td><td class="border p-2">~16</td><td class="border p-2">Buddhist + royal + national holidays</td></tr>
          <tr><td class="border p-2">8</td><td class="border p-2">Nigeria</td><td class="border p-2">NG</td><td class="border p-2">~15</td><td class="border p-2">Federal + Islamic + Christian holidays</td></tr>
        </tbody>
      </table>

      <h3>🥈 Tier 2: 11-14 Holidays (Above Average)</h3>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Rank</th>
            <th class="border p-2">Country</th>
            <th class="border p-2">Holidays</th>
            <th class="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">9</td><td class="border p-2">South Korea</td><td class="border p-2">13</td><td class="border p-2">Seollal + Chuseok + national holidays</td></tr>
          <tr><td class="border p-2">10</td><td class="border p-2">Taiwan</td><td class="border p-2">13</td><td class="border p-2">Lunar + national holidays</td></tr>
          <tr><td class="border p-2">11</td><td class="border p-2">Hong Kong</td><td class="border p-2">13</td><td class="border p-2">Chinese + Western holidays</td></tr>
          <tr><td class="border p-2">12</td><td class="border p-2">Malaysia</td><td class="border p-2">~13</td><td class="border p-2">Islamic + Chinese + Hindu + national</td></tr>
          <tr><td class="border p-2">13</td><td class="border p-2">UAE</td><td class="border p-2">~13</td><td class="border p-2">Variable Islamic calendar</td></tr>
          <tr><td class="border p-2">14</td><td class="border p-2">Saudi Arabia</td><td class="border p-2">~13</td><td class="border p-2">Islamic calendar based</td></tr>
          <tr><td class="border p-2">15</td><td class="border p-2">Argentina</td><td class="border p-2">12</td><td class="border p-2">Bridge holidays included</td></tr>
          <tr><td class="border p-2">16</td><td class="border p-2">Brazil</td><td class="border p-2">12</td><td class="border p-2">Carnival half-days included</td></tr>
          <tr><td class="border p-2">17</td><td class="border p-2">South Africa</td><td class="border p-2">12</td><td class="border p-2">Rich cultural diversity reflected</td></tr>
          <tr><td class="border p-2">18</td><td class="border p-2">Russia</td><td class="border p-2">12</td><td class="border p-2">Long New Year break (Jan 1-8)</td></tr>
          <tr><td class="border p-2">19</td><td class="border p-2">Israel</td><td class="border p-2">~12</td><td class="border p-2">Jewish calendar based</td></tr>
          <tr><td class="border p-2">20</td><td class="border p-2">Spain</td><td class="border p-2">12</td><td class="border p-2">Including 2 autonomous community holidays</td></tr>
          <tr><td class="border p-2">21</td><td class="border p-2">Austria</td><td class="border p-2">11</td><td class="border p-2">9 nationwide + 2 state-specific</td></tr>
          <tr><td class="border p-2">22</td><td class="border p-2">Belgium</td><td class="border p-2">11</td><td class="border p-2">10 nationwide + 1 regional</td></tr>
          <tr><td class="border p-2">23</td><td class="border p-2">France</td><td class="border p-2">11</td><td class="border p-2">Standard across metropolitan France</td></tr>
          <tr><td class="border p-2">24</td><td class="border p-2">Germany</td><td class="border p-2">11</td><td class="border p-2">Average including 2 state holidays</td></tr>
          <tr><td class="border p-2">25</td><td class="border p-2">Greece</td><td class="border p-2">11</td><td class="border p-2">Orthodox Christian calendar</td></tr>
          <tr><td class="border p-2">26</td><td class="border p-2">Italy</td><td class="border p-2">11</td><td class="border p-2">Patron saint day varies by city</td></tr>
          <tr><td class="border p-2">27</td><td class="border p-2">Poland</td><td class="border p-2">11</td><td class="border p-2">All fixed Catholic holidays</td></tr>
          <tr><td class="border p-2">28</td><td class="border p-2">Portugal</td><td class="border p-2">11</td><td class="border p-2">Including 2 optional municipal holidays</td></tr>
          <tr><td class="border p-2">29</td><td class="border p-2">Sweden</td><td class="border p-2">11</td><td class="border p-2">Midsummer + National Day</td></tr>
          <tr><td class="border p-2">30</td><td class="border p-2">Switzerland</td><td class="border p-2">11</td><td class="border p-2">Varies significantly by canton</td></tr>
        </tbody>
      </table>

      <h3>🥉 Tier 3: 8-10 Holidays (Developed Economy Average)</h3>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Rank</th>
            <th class="border p-2">Country</th>
            <th class="border p-2">Holidays</th>
            <th class="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">31</td><td class="border p-2">Netherlands</td><td class="border p-2">10</td><td class="border p-2">Liberation Day every 5 years</td></tr>
          <tr><td class="border p-2">32</td><td class="border p-2">Ireland</td><td class="border p-2">10</td><td class="border p-2">St. Patrick's Day is major</td></tr>
          <tr><td class="border p-2">33</td><td class="border p-2">Norway</td><td class="border p-2">10</td><td class="border p-2">Constitution Day (May 17) is huge</td></tr>
          <tr><td class="border p-2">34</td><td class="border p-2">Finland</td><td class="border p-2">10</td><td class="border p-2">Vappu + Midsummer key celebrations</td></tr>
          <tr><td class="border p-2">35</td><td class="border p-2">Denmark</td><td class="border p-2">9</td><td class="border p-2">Store Bededag (Great Prayer Day)</td></tr>
          <tr><td class="border p-2">36</td><td class="border p-2">Canada</td><td class="border p-2">9</td><td class="border p-2">Provincial holidays add more</td></tr>
          <tr><td class="border p-2">37</td><td class="border p-2">New Zealand</td><td class="border p-2">9</td><td class="border p-2">Matariki included since 2022</td></tr>
          <tr><td class="border p-2">38</td><td class="border p-2">Turkey</td><td class="border p-2">~9</td><td class="border p-2">Islamic holidays + national days</td></tr>
          <tr><td class="border p-2">39</td><td class="border p-2">United Kingdom</td><td class="border p-2">8</td><td class="border p-2">England & Wales standard</td></tr>
          <tr><td class="border p-2">40</td><td class="border p-2">Australia</td><td class="border p-2">8</td><td class="border p-2">Territory-specific adds 1-2</td></tr>
          <tr><td class="border p-2">41</td><td class="border p-2">Czechia</td><td class="border p-2">8</td><td class="border p-2">Czech Statehood Day (Sep 28)</td></tr>
          <tr><td class="border p-2">42</td><td class="border p-2">United States</td><td class="border p-2">8-11</td><td class="border p-2">11 federal, 8 standard observed</td></tr>
          <tr><td class="border p-2">43</td><td class="border p-2">Mexico</td><td class="border p-2">7-8</td><td class="border p-2">Mandatory holidays in labor law</td></tr>
        </tbody>
      </table>

      <h3>📊 Key Takeaways</h3>
      <ul>
        <li><strong>Asia leads globally:</strong> 5 of the top 10 countries are in Asia, reflecting the cultural importance of lunar calendar festivals plus national days.</li>
        <li><strong>Europe averages 10-11:</strong> Most European countries cluster in the 10-11 range, with southern Europe slightly ahead of the north.</li>
        <li><strong>The US ranks low:</strong> With only 8-11 federal holidays, the US is among the lower third — though most Americans receive additional PTO through their employer.</li>
        <li><strong>Variable holidays matter:</strong> Islamic calendar countries have ~13 holidays but the exact dates shift each year.</li>
      </ul>

      <p>Want to check specific dates for any country? Visit <a href="https://public-holidays.shop">Public Holidays</a> — we track all 46 countries with monthly updates, ICS calendar subscriptions, and long weekend planning tools.</p>
    `,
  },

  // --- POST 7: Long Weekend Opportunities 2027 ---
  {
    id: 7,
    title: "Long Weekend Opportunities in 46 Countries: The Ultimate 2027 Guide",
    slug: "long-weekend-opportunities-46-countries-2027-guide",
    category: "travel",
    author: "PubHoliday Research Team",
    publishedDate: "2026-07-28T10:00:00Z",
    lastModified: "2026-07-28T10:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/long-weekend-2027-guide.svg",
    excerpt: "Find the best long weekend opportunities across 46 countries in 2027. Learn which months offer the most bridge-day potential for maximizing your time off.",
    relatedCountries: ["US", "GB", "CN", "JP", "DE", "AU", "BR", "SG", "IN", "KR"],
    locale: "en",
    content: `
      <p>Nothing beats a three-day weekend. But with strategic planning — taking just <strong>one or two days off</strong> around public holidays — you can unlock 4-day or even 9-day breaks. We've analyzed 2027's holiday calendar across all 46 countries to find the best long weekend opportunities.</p>

      <h2>What Is a "Bridge Day" Long Weekend?</h2>
      <p>A bridge day (also called "puente" in Spanish-speaking countries) is when a public holiday falls on a Tuesday or Thursday — taking one day off creates a 4-day weekend. When multiple holidays cluster or bridge days stack, you can unlock 5-9 day breaks.</p>

      <h2>Best Long Weekend Opportunities by Month (2027)</h2>

      <h3>January 2027</h3>
      <p><strong>Global winner:</strong> New Year's Day (Friday, Jan 1) — automatic 3-day weekend in every country.</p>
      <p><strong>Russia:</strong> The New Year break (Jan 1-8) is a <strong>8-day national holiday</strong> — the world's longest single holiday period.</p>
      <p><strong>Japan:</strong> Jan 1 + weekend creates a 3-day weekend.</p>
      <p><strong>Australia:</strong> Australia Day (Tuesday, Jan 26) — take Monday Jan 25 off for 4-day weekend.</p>
      <p><strong>New Zealand:</strong> Waitangi Day (Saturday, Feb 6) — observed Monday Feb 8 for 3-day weekend.</p>

      <h3>February 2027</h3>
      <p><strong>China/HK/TW:</strong> Chinese New Year (Feb 6-12) — up to <strong>7 days off</strong>! This is the single best long weekend opportunity in Asia.</p>
      <p><strong>US:</strong> Presidents' Day (Monday, Feb 15) — automatic 3-day weekend.</p>
      <p><strong>Canada:</strong> Family Day (various dates in Feb) — 3-day weekend in most provinces.</p>
      <p><strong>Brazil:</strong> Carnival (Feb 9-10, Tue-Wed) — take Thu-Sat off for a 9-day break with Easter planning.</p>

      <h3>March 2027</h3>
      <p><strong>Global:</strong> Good Friday (Friday, Mar 26) + Easter Monday (Monday, Mar 29) — take 4 days off (Mar 24-26 or Mar 29-Apr 1) for <strong>9 consecutive days</strong> with the surrounding weekend.</p>
      <p><strong>South Africa:</strong> Human Rights Day (Sunday Mar 21) + Good Friday → full holiday corridor.</p>

      <h3>April 2027</h3>
      <p><strong>Netherlands:</strong> King's Day (Tuesday, Apr 27) — take Monday Apr 26 off for 4-day weekend.</p>
      <p><strong>Denmark:</strong> Great Prayer Day (Friday, Apr 23) — 3-day weekend.</p>
      <p><strong>Italy:</strong> Liberation Day (Sunday, Apr 25) — observed Monday Apr 26 for 3-day weekend.</p>
      <p><strong>Australia/NZ:</strong> Anzac Day (Sunday, Apr 25) — observed Monday Apr 26.</p>

      <h3>May 2027 — THE BEST MONTH FOR LONG WEEKENDS</h3>
      <p>May 2027 is spectacular for long weekends in many countries:</p>
      <ul>
        <li><strong>Global:</strong> Labour Day (Saturday, May 1) — observed Mon May 3 in many countries.</li>
        <li><strong>Japan:</strong> Golden Week (Apr 29 - May 5) — this is the absolute peak. <strong>7 consecutive days of holidays</strong>. No bridge days needed.</li>
        <li><strong>UK/Ireland:</strong> Early May Bank Holiday (Monday, May 3) + Spring Bank Holiday (Monday, May 31) — two automatic 3-day weekends!</li>
        <li><strong>Europe:</strong> Ascension Day (Thursday, May 6) take Friday off → 4-day weekend. Whit Monday (May 17) → 3-day weekend.</li>
        <li><strong>France:</strong> Ascension Day + Whit Monday + Labour Day creates multiple 3-4 day weekends in May.</li>
        <li><strong>South Korea:</strong> Children's Day (Wednesday, May 5) + Buddha's Birthday (Tuesday, May 11) — strategic bridge days.</li>
      </ul>

      <h3>June 2027</h3>
      <p><strong>Sweden/Finland:</strong> National Day (Sunday Jun 6, observed Monday) + Midsummer (Jun 25-26) — two long weekends.</p>
      <p><strong>Denmark:</strong> Constitution Day (Saturday, Jun 5).</p>
      <p><strong>China:</strong> Dragon Boat Festival (Wednesday, Jun 9) — take Jun 7-8 or Jun 10-11 off.</p>
      <p><strong>Spain:</strong> Corpus Christi (Thursday, Jun 3) — take Friday off.</p>

      <h3>July 2027</h3>
      <p><strong>US:</strong> Independence Day (Sunday, Jul 4 — observed Monday Jul 5) — 3-day weekend.</p>
      <p><strong>Canada:</strong> Canada Day (Thursday, Jul 1) — take Friday Jul 2 off for 4-day weekend.</p>
      <p><strong>France:</strong> Bastille Day (Wednesday, Jul 14).</p>
      <p><strong>Belgium:</strong> National Day (Wednesday, Jul 21).</p>

      <h3>August 2027</h3>
      <p><strong>UK/Ireland:</strong> Summer Bank Holiday (Monday, Aug 30) — 3-day weekend (England/Wales/Ireland).</p>
      <p><strong>Canada:</strong> Civic Holiday (Monday, Aug 2) — 3-day weekend (most provinces).</p>
      <p><strong>South Korea:</strong> Liberation Day (Sunday, Aug 15 — observed Monday).</p>
      <p><strong>India/Indonesia:</strong> Independence Days (Aug 15/17) — 3-day weekends depending on weekday.</p>

      <h3>September 2027</h3>
      <p><strong>US/Canada:</strong> Labour Day (Monday, Sep 6) — 3-day weekend, the traditional end of summer.</p>
      <p><strong>China:</strong> Mid-Autumn Festival (Wednesday, Sep 15) — strategic bridge day potential.</p>
      <p><strong>South Korea:</strong> Chuseok (Sep 15-17) — Korea's Thanksgiving, a 3-day holiday.</p>
      <p><strong>Brazil:</strong> Independence Day (Tuesday, Sep 7) — take Monday off.</p>

      <h3>October 2027</h3>
      <p><strong>China:</strong> National Day Golden Week (Oct 1-7) — <strong>7 days off</strong>, China's second major travel period.</p>
      <p><strong>Germany:</strong> German Unity Day (Sunday, Oct 3 — observed Monday) — 3-day weekend.</p>
      <p><strong>US/Canada:</strong> Columbus/Thanksgiving (Monday, Oct 11) — 3-day weekend (Canada's Thanksgiving!).</p>
      <p><strong>South Korea:</strong> Hangul Day (Saturday, Oct 9 — observed Monday).</p>

      <h3>November 2027</h3>
      <p><strong>US:</strong> Thanksgiving (Thursday, Nov 25) — take Friday Nov 26 off → <strong>4-day weekend</strong>. This is the biggest travel weekend in America.</p>
      <p><strong>France/Belgium:</strong> Armistice Day (Thursday, Nov 11) — take Friday off.</p>
      <p><strong>Japan:</strong> Labour Thanksgiving Day (Tuesday, Nov 23) — take Monday off.</p>

      <h3>December 2027</h3>
      <p><strong>Global:</strong> Christmas (Saturday, Dec 25) + Boxing Day (Sunday, Dec 26) — most countries observe Monday Dec 27 and Tuesday Dec 28. Take Dec 29-31 off (3 days) for a <strong>12-day break</strong> from Dec 24 through Jan 2!</p>
      <p><strong>Latin America:</strong> Christmas + New Year's creates the same 10-12 day corridor.</p>

      <h2>Top 5 Countries for Long Weekends in 2027</h2>
      <ol>
        <li><strong>🇯🇵 Japan</strong> — Golden Week alone makes it the winner. Plus substitute holidays and 3 Monday holidays.</li>
        <li><strong>🇨🇳 China</strong> — Spring Festival 7-day + National Day 7-day = 14 guaranteed off days in clusters.</li>
        <li><strong>🇰🇷 South Korea</strong> — Seollal + Chuseok + Children's Day + multiple Monday substitutes.</li>
        <li><strong>🇫🇷 France</strong> — May is a long weekend paradise with Ascension + Labour Day + Whit Monday.</li>
        <li><strong>🇪🇸 Spain</strong> — Bridge day culture (puente) is embedded in Spanish work life.</li>
      </ol>

      <h2>Plan Your 2027 Long Weekends</h2>
      <p>Use our free <a href="https://public-holidays.shop">Public Holidays tool</a> to explore each country's long weekends interactively. Subscribe to the ICS calendar feed for any country and sync directly with Google Calendar, Apple Calendar, or Outlook.</p>
    `,
    faq: [
      {
        question: "What is a July long weekend?",
        answer:
          "A July long weekend occurs when a July public holiday falls on a Friday or Monday — for example, US Independence Day (Jul 4, observed Mon Jul 5 in 2027) gives a 3-day weekend, and Canada Day (Jul 1) becomes a 4-day weekend if you take Jul 2 off. Our Long Weekend Planner lists every such opportunity per country.",
      },
      {
        question: "Are weekends public holidays?",
        answer:
          "No — Saturday and Sunday are not public holidays by themselves. But when a public holiday lands on a Friday or Monday it creates a long weekend, and taking one bridge day can stretch it to four days. See the per-country long-weekend list above.",
      },
      {
        question: "When is the next long weekend in 2027?",
        answer:
          "The next long weekend depends on your country, but reliable global standouts include New Year's Day (Jan 1, Friday), Europe's May Ascension/Whit Monday cluster, and the US Thanksgiving 4-day weekend (Nov 25). The full per-country breakdown is in the guide above.",
      },
    ],
  },

  // --- POST 8: China vs USA vs Europe Holiday Culture ---
  {
    id: 8,
    title: "China vs USA vs Europe: How Holiday Cultures Shape Work-Life Balance",
    slug: "china-vs-usa-vs-europe-holiday-cultures-comparison",
    category: "culture",
    author: "PubHoliday Research Team",
    publishedDate: "2026-07-28T11:00:00Z",
    lastModified: "2026-07-28T11:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/holiday-culture-comparison.svg",
    excerpt: "A deep dive into how holiday cultures differ between China, the United States, and Europe — and what this means for work-life balance, business, and travel.",
    relatedCountries: ["CN", "US", "DE", "FR", "GB", "ES", "JP", "IN"],
    locale: "en",
    content: `
      <p>How a society approaches public holidays reveals deep truths about its culture, values, and relationship with work. In this article, we compare three major holiday cultures — <strong>China, the United States, and Europe</strong> — examining how each approaches time off and what that means for global business and travelers.</p>

      <h2>The Big Picture: Three Philosophies</h2>

      <h3>China: "Clustered Time Off — When You're Off, Everyone Is"</h3>
      <p>China has 16 public holidays but arranges them into <strong>two massive 7-day breaks</strong> (Spring Festival and National Day Golden Week) plus several 3-day weekends. The result: intense travel rushes (<strong>600+ million trips</strong> during Golden Week), fully shuttered businesses, and a clear on/off rhythm. Chinese holiday culture is collective — when the country takes a holiday, everything stops.</p>

      <h3>United States: "Few Mandatory Holidays, Heavy Emphasis on Individual PTO"</h3>
      <p>The US has only 8-11 federal holidays, and no federal law mandates paid holiday leave. Instead, American workers negotiate PTO through employers. The average American gets <strong>10-15 PTO days</strong> (including sick leave) — significantly less than Europe. US holiday culture is individualistic: Memorial Day, Independence Day, Labor Day, and Thanksgiving create long weekends, but there's no concept of a "national shutdown" outside Christmas/New Year.</p>

      <h3>Europe: "Maximum Mandatory Holidays + Strong Worker Protections"</h3>
      <p>European countries mandate <strong>20-30 days of paid annual leave</strong> plus 10-11 public holidays. The EU's Working Time Directive guarantees 4 weeks minimum. European holiday culture treats August as a near-universal vacation month (especially in France, Italy, Spain, and Greece). Many businesses close for 2-3 weeks in summer. The culture says: "time off is a right, not a privilege."</p>

      <h2>Comparison Table: Holiday Entitlement by Region</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Metric</th>
            <th class="border p-2">China</th>
            <th class="border p-2">USA</th>
            <th class="border p-2">Germany</th>
            <th class="border p-2">France</th>
            <th class="border p-2">UK</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">Public Holidays</td><td class="border p-2">16</td><td class="border p-2">11</td><td class="border p-2">9-13</td><td class="border p-2">11</td><td class="border p-2">8</td></tr>
          <tr><td class="border p-2">Statutory Annual Leave</td><td class="border p-2">5-15 days</td><td class="border p-2">0*</td><td class="border p-2">24 days</td><td class="border p-2">25 days</td><td class="border p-2">28 days</td></tr>
          <tr><td class="border p-2">Total Potential Days Off</td><td class="border p-2">~31</td><td class="border p-2">~19</td><td class="border p-2">~35</td><td class="border p-2">~36</td><td class="border p-2">~36</td></tr>
          <tr><td class="border p-2">Major Holiday Clusters</td><td class="border p-2">2×7-day</td><td class="border p-2">None</td><td class="border p-2">Christmas/New Year</td><td class="border p-2">May + August</td><td class="border p-2">Christmas/Summer</td></tr>
          <tr><td class="border p-2">Bridge Day Culture</td><td class="border p-2">Rare (fixed)</td><td class="border p-2">Common (informal)</td><td class="border p-2">Common (formal)</td><td class="border p-2">Very common (le pont)</td><td class="border p-2">Moderate</td></tr>
        </tbody>
      </table>
      <p><em>* US has no federal statutory paid leave; benefits are employer-negotiated.</em></p>

      <h2>How This Impacts Global Business</h2>
      <h3>For Remote Teams and Digital Nomads</h3>
      <p>Understanding these differences is critical for global team coordination:</p>
      <ul>
        <li><strong>Chinese New Year (Feb 2027):</strong> Expect 1-2 weeks of reduced capacity from Chinese team members and partners.</li>
        <li><strong>European August:</strong> French and Italian businesses effectively close for 2-3 weeks. German businesses remain open but many individuals take vacation.</li>
        <li><strong>US Thanksgiving (Nov 25):</strong> The Wednesday before through Sunday after is effectively a dead zone — plan project deadlines around it.</li>
        <li><strong>Japanese Golden Week (Apr 29-May 5):</strong> Nearly complete shutdown of Japanese businesses for 7 days.</li>
      </ul>

      <h3>For Business Travelers</h3>
      <ul>
        <li><strong>Best months for international travel:</strong> February (after CNY) and September (after European summer).</li>
        <li><strong>Worst months for international meetings:</strong> August (Europe), October 1-7 (China), December 20-January 5 (globally).</li>
        <li><strong>Best for domestic US business:</strong> February, September, and November (before Thanksgiving week).</li>
      </ul>

      <h2>Which Culture Gets It Right?</h2>
      <p>There's no universal answer. China's clustered approach enables massive travel and family reunions but creates pressure during work periods. Europe's generous leave policies support wellbeing but can slow business pace. The US's flexibility allows year-round productivity but risks employee burnout.</p>
      <p>The ideal approach? Borrow from each: take Europe's minimum leave standards, China's celebration of shared holidays, and America's flexibility in individual PTO arrangements.</p>

      <h2>Explore Each Country's Holidays</h2>
      <p>Visit <a href="https://public-holidays.shop">Public Holidays</a> to see the full holiday calendar for any of our 46 countries. Subscribe to ICS feeds to keep your calendar synchronized across time zones and cultures.</p>
    `,
  },

  // ========================================================================
  // CHINESE (zh) VERSIONS — Phase 1.2
  // ========================================================================

  // --- ZH POST 1: German Holiday Pay ---
  {
    id: 101,
    title: "德国假期工资怎么算？2027年德国公共假期与薪酬指南",
    slug: "how-to-calculate-holiday-pay-in-germany",
    category: "finance",
    author: "Michael Weber",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/germany-holiday-pay.svg",
    excerpt: "全面解析德国公共假期工资计算方式，帮助在德工作人士了解法定假日薪酬规定。",
    relatedCountries: ["DE"],
    locale: "zh",
    content: `
      <p>德国的假期工资由《工资继续支付法》（Entgeltfortzahlungsgesetz）监管。当法定公共假期落在工作日时，即使员工不工作，也有权获得正常工资。</p>
      <h2>德国假期工资的核心规则</h2>
      <ul>
        <li><strong>休假权利：</strong>在公共假期，员工有权获得正常的日薪。</li>
        <li><strong>假期工作：</strong>如果在公共假期工作，通常有权获得补休或额外津贴（通常增加25-50%）。</li>
        <li><strong>各州差异：</strong>德国每个州（Bundesland）都有自己的假期日历。</li>
      </ul>
      <h2>计算示例</h2>
      <p>如果月薪为3,500欧元，每月工作22天，则日薪约为159欧元。如果在公共假期工作，将获得正常日薪加假期津贴。</p>
      <h2>2027年德国公共假期</h2>
      <p>德国有<strong>9个全国性公共假期</strong>和各州特定假期。关键日期：元旦（1月1日）、耶稣受难日（3月26日）、复活节星期一（3月29日）、劳动节（5月1日）、耶稣升天节（5月6日）、圣灵降临节（5月17日）、德国统一日（10月3日）、圣诞节（12月25日）、节礼日（12月26日）。巴伐利亚等州还有主显节（1月6日）、圣体节（6月3日）和圣母升天节（8月15日），总计最多13天。</p>
      <p>查看完整德国假期日历，请访问<a href="https://public-holidays.shop/zh/DE">德国假期页面</a>。</p>
    `,
  },

  // --- ZH POST 2: UK Bank Holidays ---
  {
    id: 102,
    title: "英国公共假期与银行假日完全指南",
    slug: "uk-public-holidays-and-bank-days-explained",
    category: "work",
    author: "Emma Thompson",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.svg",
    excerpt: "全面解读英国银行假日体系，涵盖英格兰、苏格兰和北爱尔兰的区别。",
    relatedCountries: ["GB"],
    locale: "zh",
    content: `
      <p>英国的公共假期体系较为复杂，英格兰与威尔士、苏格兰和北爱尔兰各有不同。</p>
      <h2>各地区银行假日</h2>
      <p><strong>英格兰与威尔士：</strong>每年通常有8个银行假日，包括元旦、复活节星期一、五月初银行假日、春季银行假日、夏季银行假日、圣诞节和节礼日。</p>
      <p><strong>苏格兰：</strong>额外节日包括1月2日。</p>
      <p><strong>北爱尔兰：</strong>包括7月12日的奥兰治日。</p>
      <h2>假期落在周末怎么办？</h2>
      <p>如果银行假日落在周末，通常会指定一个替代工作日。2027年圣诞节在周六，替代日为12月27日星期一。</p>
      <p>查看完整列表，请访问<a href="https://public-holidays.shop/zh/GB">英国假期页面</a>。</p>
    `,
  },

  // --- ZH POST 3: Japan Remote Work ---
  {
    id: 103,
    title: "日本公共假期指南：远程工作者和数字游民必读",
    slug: "remote-work-holidays-in-japan",
    category: "work",
    author: "Yuki Tanaka",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/japan-remote-work.svg",
    excerpt: "日本拥有16个法定公共假期，是发达国家中最多的。了解日本假期日历对远程工作者至关重要。",
    relatedCountries: ["JP"],
    locale: "zh",
    content: `
      <p>日本拥有世界上最丰富的公共假期日历之一，每年有<strong>16个法定假期</strong>——在发达国家中数量最多。</p>
      <h2>2027年日本公共假期</h2>
      <ul>
        <li>元旦 — 1月1日</li>
        <li>成人日 — 1月11日（1月第2个周一）</li>
        <li>建国纪念日 — 2月11日</li>
        <li>春分日 — 3月21日</li>
        <li>昭和日 — 4月29日</li>
        <li>宪法纪念日 — 5月3日</li>
        <li>绿之日 — 5月4日</li>
        <li>儿童日 — 5月5日</li>
        <li>海之日 — 7月19日（7月第3个周一）</li>
        <li>敬老日 — 9月20日（9月第3个周一）</li>
        <li>秋分日 — 9月23日</li>
        <li>体育日 — 10月11日（10月第2个周一）</li>
        <li>文化日 — 11月3日</li>
        <li>勤劳感谢日 — 11月23日</li>
        <li>天皇诞生日 — 2月23日</li>
      </ul>
      <h2>黄金周：日本最长的假期</h2>
      <p>4月29日至5月5日是日本的<strong>黄金周</strong>——连续7天假期。远程工作者应提前规划，此期间日本企业基本全面关闭。</p>
      <p>查看准确日期，请访问<a href="https://public-holidays.shop/zh/JP">日本假期页面</a>。</p>
    `,
  },

  // --- ZH POST 4: Chinese New Year ---
  {
    id: 104,
    title: "春节的文化意义：中国最重要节日的传承与习俗",
    slug: "cultural-significance-of-chinese-new-year",
    category: "culture",
    author: "Li Wei",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/chinese-new-year.svg",
    excerpt: "深入解读中国春节的历史渊源、传统习俗和文化内涵。",
    relatedCountries: ["CN", "HK", "TW"],
    locale: "zh",
    content: `
      <p>春节是中国最重要的传统节日。2027年春节为<strong>2月6日</strong>（羊年）。</p>
      <h2>历史渊源</h2>
      <p>春节起源于4000多年前的商朝时期。传说中"年"兽会在年末袭击村庄，但被响声、红色和火光吓跑——这成为春节传统的起源。</p>
      <h2>主要传统习俗</h2>
      <ul>
        <li><strong>红包：</strong>长辈给晚辈发红包，寓意祝福和好运。</li>
        <li><strong>年夜饭：</strong>除夕夜的全家团圆饭，是一年中最重要的一餐。</li>
        <li><strong>烟花爆竹：</strong>驱赶邪灵，迎接新年。</li>
        <li><strong>舞龙舞狮：</strong>带来吉祥和繁荣的表演。</li>
      </ul>
      <h2>假期时长</h2>
      <p>中国大陆的春节法定假期为<strong>7天</strong>，很多企业和工厂实际放假2-3周。香港和台湾各放假4天。</p>
      <p>查看准确日期，请访问<a href="https://public-holidays.shop/zh/CN">中国假期页面</a>。</p>
    `,
  },

  // --- ZH POST 5: Global Holidays 2027 Calendar ---
  {
    id: 105,
    title: "2027年全球公共假期完整日历：涵盖46个国家",
    slug: "global-public-holidays-2027-complete-calendar",
    category: "data",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/global-holidays-2027-calendar.svg",
    excerpt: "2027年全球46个国家公共假期完整汇总。无论你是规划跨国旅行、管理全球团队，还是安排跨境业务，这份日历都是你的必备参考。",
    relatedCountries: ["US", "GB", "CN", "JP", "DE", "FR", "AU", "CA", "IN", "BR", "SG", "KR"],
    locale: "zh",
    content: `
      <p>计划2027年的国际旅行、管理全球团队或安排跨境业务？我们汇总了<strong>46个国家</strong>的完整公共假期日历。这是你全年的权威参考。</p>

      <h2>亚太地区2027年假期</h2>
      <h3>中国 — 16个公共假期</h3>
      <p>关键日期：元旦（1月1日）、春节（2月6-12日，7天长假）、清明节（4月5日）、劳动节（5月1日）、端午节（6月9日）、中秋节（9月15日）、国庆节（10月1-7日，7天长假）。春节和国庆黄金周是中国两大出行高峰。</p>

      <h3>日本 — 16个法定假期</h3>
      <p>黄金周（4月29日-5月5日）是最大的假期集群。详细信息请参见日本假期专题文章。</p>

      <h3>韩国 — 13个假期</h3>
      <p>关键日期：春节（2月6-8日）、三一节（3月1日）、儿童节（5月5日）、佛诞日（5月11日）、秋夕（9月15-17日）、韩文日（10月9日）、圣诞节（12月25日）。</p>

      <h2>欧洲2027年假期</h2>
      <h3>德国 — 9-13天（各州不同）</h3>
      <p>9个全国性假期，各州增加2-4天。德国统一日（10月3日）是唯一的联邦法定假日。</p>

      <h3>法国 — 11个假期</h3>
      <p>关键日期：元旦（1月1日）、复活节周一（3月29日）、劳动节（5月1日）、二战胜利日（5月8日）、耶稣升天节（5月6日）、圣灵降临节（5月17日）、国庆日（7月14日）、圣母升天节（8月15日）、诸圣节（11月1日）、停战日（11月11日）、圣诞节（12月25日）。</p>

      <h3>英国 — 8个银行假日</h3>
      <p>元旦、耶稣受难日、复活节周一、五月初银行假日、春季银行假日、夏季银行假日、圣诞节、节礼日。</p>

      <h2>北美2027年假期</h2>
      <h3>美国 — 11个联邦假日</h3>
      <p>元旦、马丁·路德·金日、总统日、阵亡将士纪念日、独立日、劳动节、哥伦布日、退伍军人节、感恩节、圣诞节。</p>

      <h3>加拿大 — 8-10个假期</h3>
      <p>维多利亚日（5月24日）、加拿大日（7月1日）、劳动节、感恩节、国殇日。各省有额外省定假日。</p>

      <h2>拉美2027年假期</h2>
      <h3>巴西 — 12个全国假日</h3>
      <p>狂欢节（2月9-10日）、耶稣受难日、独立日（9月7日）、共和国成立日（11月15日）、圣诞节等。</p>

      <h2>如何使用这份日历</h2>
      <p>所有日期来自<a href="https://date.nager.at" rel="nofollow">Nager.Date API</a>。如需最新信息，请访问：</p>
      <ul>
        <li><a href="https://public-holidays.shop">公共假期查询</a> — 覆盖46个国家的交互式假期日历</li>
        <li>通过ICS订阅将任意国家的假期日历同步到Google日历、Apple日历或Outlook</li>
        <li>使用我们的<strong>长周末规划器</strong>找到最佳请假方案</li>
      </ul>
    `,
  },

  // --- ZH POST 6: Holiday Ranking ---
  {
    id: 106,
    title: "2027年全球公共假期排名：哪些国家假期最多？",
    slug: "countries-most-public-holidays-2027-ranking",
    category: "data",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/public-holidays-ranking-2027.svg",
    excerpt: "46个国家2027年公共假期数量排名。从菲律宾的18天到墨西哥的7天，看看你的国家在第几名。",
    relatedCountries: ["US", "GB", "CN", "JP", "IN", "TH", "PH", "DE", "FR", "BR"],
    locale: "zh",
    content: `
      <p>你的国家2027年有多少天公共假期？我们分析了全部<strong>46个国家</strong>的数据，带来这份权威排名。</p>

      <h2>2027年全球排名</h2>

      <h3>🥇 第一梯队：15-18天（全球最慷慨的国家）</h3>
      <ul>
        <li><strong>1. 菲律宾</strong> — 约18天（含常规日+特别非工作日）</li>
        <li><strong>2. 日本</strong> — 16天（含调休假日）</li>
        <li><strong>3. 中国</strong> — 16天（含调休周末）</li>
        <li><strong>4. 印度</strong> — 16天（3个全国+各邦不同）</li>
        <li><strong>5. 印度尼西亚</strong> — 约16天（伊斯兰+全国假日）</li>
        <li><strong>6. 泰国</strong> — 约16天（佛教+皇室+全国假日）</li>
        <li><strong>7. 埃及</strong> — 约16天（伊斯兰+科普特+全国假日）</li>
        <li><strong>8. 尼日利亚</strong> — 约15天（联邦+伊斯兰+基督教假日）</li>
      </ul>

      <h3>🥈 第二梯队：11-14天（高于平均水平）</h3>
      <p>包括韩国（13天）、台湾（13天）、香港（13天）、马来西亚（约13天）、阿联酋（约13天）、沙特阿拉伯（约13天）、阿根廷（12天）、巴西（12天）、南非（12天）、俄罗斯（12天）、以色列（约12天）、西班牙（12天），以及奥地利、比利时、法国、德国、希腊、意大利、波兰、葡萄牙、瑞典、瑞士等欧洲国家（各11天）。</p>

      <h3>🥉 第三梯队：8-10天（发达国家平均水平）</h3>
      <p>包括荷兰（10天）、爱尔兰（10天）、挪威（10天）、芬兰（10天）、丹麦（9天）、加拿大（9天）、新西兰（9天）、土耳其（约9天）、英国（8天）、澳大利亚（8天）、捷克（8天）、美国（8-11天）、墨西哥（7-8天）。</p>

      <h3>📊 关键结论</h3>
      <ul>
        <li><strong>亚洲领跑全球：</strong>前10名中有5个亚洲国家，反映农历节日和国庆日的文化重要性。</li>
        <li><strong>欧洲平均10-11天：</strong>南欧略多于北欧。</li>
        <li><strong>美国排名靠后：</strong>8-11个联邦假日在全球处于较低水平。</li>
        <li><strong>伊斯兰国家变动大：</strong>约13个假日但每年日期不同。</li>
      </ul>

      <p>想查任何国家的准确日期？访问<a href="https://public-holidays.shop">公共假期查询</a>——我们跟踪46个国家的数据，每月更新，支持ICS日历订阅和长周末规划。</p>
    `,
  },

  // --- ZH POST 7: Long Weekend Guide ---
  {
    id: 107,
    title: "2027年46国长周末攻略：教你用最少假期拼出最长旅行",
    slug: "long-weekend-opportunities-46-countries-2027-guide",
    category: "travel",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/long-weekend-2027-guide.svg",
    excerpt: "2027年全球46个国家的长周末机会全解析。只需请假1-2天，就能拼出4天甚至9天的超长假期。",
    relatedCountries: ["US", "GB", "CN", "JP", "DE", "AU", "BR", "SG", "IN", "KR"],
    locale: "zh",
    content: `
      <p>没有什么比三天小长假更让人期待的了。但通过策略性规划——在公共假期前后<strong>只需请假1-2天</strong>——你就能解锁4天甚至9天的超长假期。我们分析了2027年所有46个国家的假期日历，找到了最佳长周末机会。</p>

      <h2>什么是"桥梁假期"？</h2>
      <p>当公共假期落在周二或周四时，只需请假一天就能获得4天连休。当多个假期聚集或桥梁假期叠加时，你可以拼出5-9天的超长假期。</p>

      <h2>2027年逐月最佳长周末</h2>

      <h3>1月</h3>
      <p><strong>全球：</strong>元旦（1月1日周五）——自动3天周末。</p>
      <p><strong>俄罗斯：</strong>新年假期（1月1-8日）——<strong>8天</strong>，全球最长单次假期。</p>
      <p><strong>澳大利亚：</strong>澳大利亚日（1月26日周二）——请1月25日周一假，得4天周末。</p>

      <h3>2月 — 亚洲黄金月</h3>
      <p><strong>中国/香港/台湾：</strong>春节（2月6-12日）——长达<strong>7天</strong>！这是亚洲最佳假期。美国：总统日（2月15日周一）——自动3天周末。</p>
      <p><strong>巴西：</strong>狂欢节（2月9-10日，周二三）——战略性请假可拼9天。</p>

      <h3>3月</h3>
      <p><strong>全球：</strong>耶稣受难日（3月26日周五）+ 复活节周一（3月29日）——请假4天可得<strong>9天连休</strong>。</p>

      <h3>5月 — 全年最佳长周末月</h3>
      <ul>
        <li><strong>日本：</strong>黄金周（4月29日-5月5日）——<strong>7天连休</strong>，无需请假。</li>
        <li><strong>欧洲：</strong>耶稣升天节（5月6日周四）——请周五得4天周末。圣灵降临节（5月17日周一）——自动3天。</li>
        <li><strong>法国：</strong>5月有多个3-4天小长假机会。</li>
      </ul>

      <h3>6月-12月亮点</h3>
      <p><strong>6月：</strong>中国端午节（6月9日周三）——可拼桥假。北欧仲夏节（6月25-26日）。</p>
      <p><strong>10月：</strong>中国国庆黄金周（10月1-7日）——<strong>7天</strong>。加拿大感恩节（10月11日周一）——3天。</p>
      <p><strong>11月：</strong>美国感恩节（11月25日周四）——请周五得<strong>4天周末</strong>。</p>
      <p><strong>12月：</strong>圣诞节+元旦——请假12月29-31日（3天），可得从12月24日到1月2日的<strong>12天超长假期</strong>！</p>

      <h2>2027年长周末机会最多的5个国家</h2>
      <ol>
        <li><strong>🇯🇵 日本</strong> — 黄金周全球无敌。</li>
        <li><strong>🇨🇳 中国</strong> — 春节+国庆双黄金周共14天。</li>
        <li><strong>🇰🇷 韩国</strong> — 春节+秋夕+儿童节。</li>
        <li><strong>🇫🇷 法国</strong> — 5月是小长假天堂。</li>
        <li><strong>🇪🇸 西班牙</strong> — "桥假"文化根植于工作生活中。</li>
      </ol>

      <h2>规划你的2027年长周末</h2>
      <p>使用我们的免费<a href="https://public-holidays.shop">公共假期查询工具</a>探索每个国家的长周末。订阅ICS日历，直接同步到Google日历、Apple日历或Outlook。</p>
    `,
  },

  // --- ZH POST 8: Holiday Culture Comparison ---
  {
    id: 108,
    title: "中美欧假期文化大对比：三种不同的休假哲学",
    slug: "china-vs-usa-vs-europe-holiday-cultures-comparison",
    category: "culture",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-07-28T08:00:00Z",
    lastModified: "2026-07-28T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/holiday-culture-comparison.svg",
    excerpt: "深入对比中国、美国和欧洲的假期文化差异，了解不同地区如何对待休假、这对工作生活和全球商务意味着什么。",
    relatedCountries: ["CN", "US", "DE", "FR", "GB", "ES", "JP", "IN"],
    locale: "zh",
    content: `
      <p>一个社会如何对待公共假期，深刻反映了其文化、价值观和对工作的态度。本文从三个维度——<strong>中国、美国和欧洲</strong>——展开对比分析。</p>

      <h2>三种休假哲学</h2>

      <h3>🇨🇳 中国："集中式休假——要休一起休"</h3>
      <p>中国有16个公共假期，但将其安排成<strong>两个7天长假</strong>（春节和国庆黄金周）加若干3天小长假。结果是：每年产生<strong>6亿+人次</strong>的出行潮、企业全面停工、工作生活节奏分明。中国的假期文化是集体主义的——全国统一行动。</p>

      <h3>🇺🇸 美国："法定假期少，个人年假说了算"</h3>
      <p>美国只有8-11个联邦假日，联邦法律不强制带薪休假。美国员工通过雇主协商获得PTO，平均每年<strong>10-15天</strong>带薪假（含病假）——显著低于欧洲。美国的假期文化更个性化：阵亡将士纪念日、独立日、劳动节、感恩节构成长周末，但不存"全国停工"的概念（除圣诞新年外）。</p>

      <h3>🇪🇺 欧洲："最长法定假期+最强工人保护"</h3>
      <p>欧洲国家强制规定<strong>20-30天带薪年假</strong>，外加10-11个公共假期。欧盟《工作时间指令》保障至少4周带薪假。欧洲的假期文化将8月视为全民度假月（尤其法国、意大利、西班牙、希腊），许多企业夏季关门2-3周。</p>

      <h2>对比一览</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">指标</th>
            <th class="border p-2">中国</th>
            <th class="border p-2">美国</th>
            <th class="border p-2">德国</th>
            <th class="border p-2">法国</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">公共假期</td><td class="border p-2">16天</td><td class="border p-2">11天</td><td class="border p-2">9-13天</td><td class="border p-2">11天</td></tr>
          <tr><td class="border p-2">法定年假</td><td class="border p-2">5-15天</td><td class="border p-2">0天*</td><td class="border p-2">24天</td><td class="border p-2">25天</td></tr>
          <tr><td class="border p-2">潜在总休假日</td><td class="border p-2">约31天</td><td class="border p-2">约19天</td><td class="border p-2">约35天</td><td class="border p-2">约36天</td></tr>
          <tr><td class="border p-2">主要假期集群</td><td class="border p-2">2×7天</td><td class="border p-2">无</td><td class="border p-2">圣诞/新年</td><td class="border p-2">5月+8月</td></tr>
          <tr><td class="border p-2">桥假文化</td><td class="border p-2">少有</td><td class="border p-2">常见（非正式）</td><td class="border p-2">常见</td><td class="border p-2">非常普遍</td></tr>
        </tbody>
      </table>

      <h2>对全球商务的影响</h2>
      <h3>远程团队和数字游民</h3>
      <ul>
        <li><strong>春节（2027年2月）：</strong>中国团队和合作伙伴将有一到两周无法工作。</li>
        <li><strong>欧洲8月：</strong>法国和意大利企业基本关门2-3周。</li>
        <li><strong>美国感恩节（11月25日）：</strong>感恩节前后共4-5天是业务淡季。</li>
        <li><strong>日本黄金周（4月29日-5月5日）：</strong>日本企业7天全面停工。</li>
      </ul>

      <h2>哪种文化更好？</h2>
      <p>没有标准答案。中国的集中式假期方便家庭团圆但工作中压力较大。欧洲的宽松政策保障身心健康但可能拖慢节奏。美国的灵活性保持全年生产力但存在员工过劳风险。</p>
      <p>最佳做法？借鉴欧洲的最低休假标准、中国全民共享的节日庆祝方式、以及美国个人年假的灵活性。</p>

      <h2>探索更多</h2>
      <p>访问<a href="https://public-holidays.shop">公共假期查询</a>查看全部46个国家的假期日历，订阅ICS日历保持跨时区同步。</p>
    `,
  },

  // --- Day 1 (2026-08-04): US Federal Holidays 2026-2027 EN ---
  {
    id: 109,
    title: "US Federal Holidays 2026-2027: The Complete List",
    slug: "us-federal-holidays-2026-2027",
    category: "guide",
    author: "PubHoliday Research Team",
    publishedDate: "2026-08-04T08:00:00Z",
    lastModified: "2026-08-04T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/us-federal-holidays-2026-2027.svg",
    excerpt: "The complete list of US federal holidays for 2026 and 2027 with exact dates, in-lieu rules for weekend holidays, and the best long weekends.",
    relatedCountries: ["US"],
    locale: "en",
    faq: [
      { question: "How many federal holidays does the US have?", answer: "11. Both 2026 and 2027 have 11 federal holidays." },
      { question: "Are federal holidays mandatory days off?", answer: "Mandatory for federal employees; not legally required for private businesses, but most follow them. Banks, stock markets, and post offices typically close." },
      { question: "What happens when a holiday falls on a weekend?", answer: "Saturday → Friday off; Sunday → Monday off. Federal employees always get the in-lieu day, and most businesses follow." },
      { question: "What are the US federal holidays in 2026?", answer: "The 11 federal holidays in 2026: New Year's Day (1/1), MLK Day (1/19), Presidents' Day (2/16), Memorial Day (5/25), Juneteenth (6/19), Independence Day (7/4, observed 7/3), Labor Day (9/7), Columbus Day (10/12), Veterans Day (11/11), Thanksgiving (11/26), Christmas (12/25)." },
      { question: "What are the US federal holidays in 2027?", answer: "The 11 federal holidays in 2027: New Year's Day (1/1), MLK Day (1/18), Presidents' Day (2/15), Memorial Day (5/31), Juneteenth (observed 6/18), Independence Day (observed 7/5), Labor Day (9/6), Columbus Day (10/11), Veterans Day (11/11), Thanksgiving (11/25), Christmas (observed 12/24)." },
      { question: "How do I sync US holidays to my calendar?", answer: "Use PubHoliday, pick United States, and subscribe to the ICS calendar link to auto-sync to Google Calendar, Apple Calendar, or Outlook." },
    ],
    content: `
      <p>The U.S. has <strong>11 federal holidays</strong> in both 2026 and 2027. Whether you're planning travel, managing a remote team, or just want to know when banks close, this complete list has every date, the in-lieu rules for weekend holidays, and the best long weekends.</p>

      <h2>Federal Holidays vs State Holidays</h2>
      <p>Federal holidays are mandatory days off only for <strong>federal employees</strong>, but most businesses, banks, schools, and stock markets follow them. States may add their own holidays — this guide covers the 11 nationwide federal holidays.</p>

      <h2>US Federal Holidays 2026: The Complete List</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">Holiday</th><th class="border p-2">2026 Date</th><th class="border p-2">Weekday</th><th class="border p-2">Notes</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">New Year's Day</td><td class="border p-2">Jan 1</td><td class="border p-2">Thursday</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">Martin Luther King Jr. Day</td><td class="border p-2">Jan 19</td><td class="border p-2">Monday</td><td class="border p-2">3rd Monday of January</td></tr>
          <tr><td class="border p-2">Presidents' Day</td><td class="border p-2">Feb 16</td><td class="border p-2">Monday</td><td class="border p-2">3rd Monday of February</td></tr>
          <tr><td class="border p-2">Memorial Day</td><td class="border p-2">May 25</td><td class="border p-2">Monday</td><td class="border p-2">Last Monday of May</td></tr>
          <tr><td class="border p-2">Juneteenth National Independence Day</td><td class="border p-2">Jun 19</td><td class="border p-2">Friday</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">Independence Day</td><td class="border p-2">Jul 4</td><td class="border p-2">Saturday</td><td class="border p-2">⚠️ Falls on Saturday</td></tr>
          <tr><td class="border p-2">Labor Day</td><td class="border p-2">Sep 7</td><td class="border p-2">Monday</td><td class="border p-2">1st Monday of September</td></tr>
          <tr><td class="border p-2">Columbus Day</td><td class="border p-2">Oct 12</td><td class="border p-2">Monday</td><td class="border p-2">2nd Monday of October</td></tr>
          <tr><td class="border p-2">Veterans Day</td><td class="border p-2">Nov 11</td><td class="border p-2">Wednesday</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">Thanksgiving Day</td><td class="border p-2">Nov 26</td><td class="border p-2">Thursday</td><td class="border p-2">4th Thursday of November</td></tr>
          <tr><td class="border p-2">Christmas Day</td><td class="border p-2">Dec 25</td><td class="border p-2">Friday</td><td class="border p-2">—</td></tr>
        </tbody>
      </table>
      <p><strong>Note:</strong> Independence Day 2026 (July 4) falls on a Saturday. Federal employees receive Friday, July 3 as the in-lieu day off. Most private employers follow the same practice, making July 3-5 a long weekend.</p>

      <h2>US Federal Holidays 2027: The Complete List</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">Holiday</th><th class="border p-2">2027 Date</th><th class="border p-2">Weekday</th><th class="border p-2">Notes</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">New Year's Day</td><td class="border p-2">Jan 1</td><td class="border p-2">Friday</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">Martin Luther King Jr. Day</td><td class="border p-2">Jan 18</td><td class="border p-2">Monday</td><td class="border p-2">3rd Monday of January</td></tr>
          <tr><td class="border p-2">Presidents' Day</td><td class="border p-2">Feb 15</td><td class="border p-2">Monday</td><td class="border p-2">3rd Monday of February</td></tr>
          <tr><td class="border p-2">Memorial Day</td><td class="border p-2">May 31</td><td class="border p-2">Monday</td><td class="border p-2">Last Monday of May</td></tr>
          <tr><td class="border p-2">Juneteenth National Independence Day</td><td class="border p-2">Jun 18</td><td class="border p-2">Friday</td><td class="border p-2">⚠️ Jun 19 (Sat) → observed Jun 18</td></tr>
          <tr><td class="border p-2">Independence Day</td><td class="border p-2">Jul 5</td><td class="border p-2">Monday</td><td class="border p-2">⚠️ Jul 4 (Sun) → observed Jul 5</td></tr>
          <tr><td class="border p-2">Labor Day</td><td class="border p-2">Sep 6</td><td class="border p-2">Monday</td><td class="border p-2">1st Monday of September</td></tr>
          <tr><td class="border p-2">Columbus Day</td><td class="border p-2">Oct 11</td><td class="border p-2">Monday</td><td class="border p-2">2nd Monday of October</td></tr>
          <tr><td class="border p-2">Veterans Day</td><td class="border p-2">Nov 11</td><td class="border p-2">Thursday</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">Thanksgiving Day</td><td class="border p-2">Nov 25</td><td class="border p-2">Thursday</td><td class="border p-2">4th Thursday of November</td></tr>
          <tr><td class="border p-2">Christmas Day</td><td class="border p-2">Dec 24</td><td class="border p-2">Friday</td><td class="border p-2">⚠️ Dec 25 (Sat) → observed Dec 24</td></tr>
        </tbody>
      </table>
      <p><strong>2027 special note:</strong> Three holidays need in-lieu adjustments (Juneteenth, Independence Day, Christmas). July 4 falls on a Sunday, so it is observed Monday July 5 — creating a guaranteed 3-day long weekend.</p>

      <h2>The In-Lieu Rule: When a Holiday Falls on a Weekend</h2>
      <p>U.S. federal holidays follow a fixed rule: <strong>if the holiday falls on Saturday, the preceding Friday is the day off; if it falls on Sunday, the following Monday is the day off.</strong> This is why the "observed" date often differs from the calendar date — and why it's easy to miss a day off when planning travel.</p>

      <h2>Best Long Weekends in 2026-2027</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">Year</th><th class="border p-2">Long Weekend</th><th class="border p-2">How</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">2026</td><td class="border p-2">Jan 16-19 (3 days)</td><td class="border p-2">MLK Day (Monday)</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">May 23-25 (3 days)</td><td class="border p-2">Memorial Day (Monday)</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">Jul 3-5 (3 days)</td><td class="border p-2">Independence Day in-lieu (Friday) + weekend</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">Nov 26-29 (4 days)</td><td class="border p-2">Thanksgiving (Thu) + 1 day off (Fri)</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">Dec 25-27 (3 days)</td><td class="border p-2">Christmas (Friday)</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">Jul 3-5 (3 days)</td><td class="border p-2">Independence Day in-lieu (Monday)</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">Nov 25-28 (4 days)</td><td class="border p-2">Thanksgiving (Thu) + 1 day off (Fri)</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">Dec 24-26 (3 days)</td><td class="border p-2">Christmas in-lieu (Friday)</td></tr>
        </tbody>
      </table>
      <p><strong>Best trick:</strong> Take 1 day off (Friday) during Thanksgiving week and you get a 4-day weekend; add the following Monday for a 5-day break.</p>

      <h2>Sync US Holidays to Your Calendar</h2>
      <p>Stop checking dates every year. Open <a href="https://public-holidays.shop">PubHoliday</a>, select <strong>United States</strong>, and subscribe to the ICS calendar link — your Google Calendar, Apple Calendar, or Outlook updates automatically, every year.</p>
    `,
  },

  // --- Day 1 (2026-08-04): US Federal Holidays 2026-2027 ZH ---
  {
    id: 110,
    title: "美国 2026-2027 联邦假日完整清单",
    slug: "us-federal-holidays-2026-2027",
    category: "guide",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-08-04T08:00:00Z",
    lastModified: "2026-08-04T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/us-federal-holidays-2026-2027.svg",
    excerpt: "2026 年美国有 11 个联邦假日，2027 年同样 11 个。完整清单 + 具体日期 + 放假规则（含调休日）+ 长周末攻略，一文讲清。",
    relatedCountries: ["US"],
    locale: "zh",
    faq: [
      { question: "美国一年有几个联邦假日？", answer: "11 个。2026 和 2027 年都是 11 个联邦假日。" },
      { question: "联邦假日是强制放假吗？", answer: "对联邦政府雇员是强制的；对私人企业不是法律强制，但绝大多数企业跟随。银行、股市、邮局通常在联邦假日关闭。" },
      { question: "假日落在周末怎么办？", answer: "落在周六 → 周五调休；落在周日 → 下周一调休。联邦雇员必得调休，多数企业跟随。" },
      { question: "2026 年有哪些美国联邦假日？", answer: "2026 年 11 个联邦假日：元旦(1/1)、MLK Day(1/19)、总统日(2/16)、阵亡将士纪念日(5/25)、六月节(6/19)、独立日(7/4，周六调休至7/3)、劳动节(9/7)、哥伦布日(10/12)、退伍军人节(11/11)、感恩节(11/26)、圣诞节(12/25)。" },
      { question: "2027 年有哪些美国联邦假日？", answer: "2027 年 11 个联邦假日：元旦(1/1)、MLK Day(1/18)、总统日(2/15)、阵亡将士纪念日(5/31)、六月节(6/18 调休)、独立日(7/5 调休)、劳动节(9/6)、哥伦布日(10/11)、退伍军人节(11/11)、感恩节(11/25)、圣诞节(12/24 调休)。" },
      { question: "如何在日历上自动同步美国假日？", answer: "用 PubHoliday 选择 United States，订阅 ICS 日历链接，即可自动同步到 Google Calendar、Apple Calendar、Outlook。" },
    ],
    content: `
      <p>2026 年美国有 <strong>11 个联邦假日</strong>，2027 年同样 11 个。无论你是规划旅行、管理远程团队，还是想知道银行哪天关门——这份完整清单包含每个具体日期、周末假日的调休规则，以及最佳长周末攻略。</p>

      <h2>联邦假日 vs 州假日</h2>
      <p>联邦假日（federal holidays）只对<strong>联邦政府雇员</strong>强制放假，但绝大多数企业、银行、学校会跟随联邦假日安排休息。各州可以增加自己的州假日，本文聚焦全美通用的 11 个联邦假日。</p>

      <h2>2026 年美国联邦假日完整清单</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">假日</th><th class="border p-2">2026 日期</th><th class="border p-2">星期</th><th class="border p-2">备注</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">元旦</td><td class="border p-2">1月1日</td><td class="border p-2">周四</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">马丁·路德·金纪念日</td><td class="border p-2">1月19日</td><td class="border p-2">周一</td><td class="border p-2">1月第三个周一</td></tr>
          <tr><td class="border p-2">总统日（华盛顿诞辰）</td><td class="border p-2">2月16日</td><td class="border p-2">周一</td><td class="border p-2">2月第三个周一</td></tr>
          <tr><td class="border p-2">阵亡将士纪念日</td><td class="border p-2">5月25日</td><td class="border p-2">周一</td><td class="border p-2">5月最后一个周一</td></tr>
          <tr><td class="border p-2">六月节（Juneteenth）</td><td class="border p-2">6月19日</td><td class="border p-2">周五</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">独立日</td><td class="border p-2">7月4日</td><td class="border p-2">周六</td><td class="border p-2">⚠️ 落在周六</td></tr>
          <tr><td class="border p-2">劳动节</td><td class="border p-2">9月7日</td><td class="border p-2">周一</td><td class="border p-2">9月第一个周一</td></tr>
          <tr><td class="border p-2">哥伦布日（原住民日）</td><td class="border p-2">10月12日</td><td class="border p-2">周一</td><td class="border p-2">10月第二个周一</td></tr>
          <tr><td class="border p-2">退伍军人节</td><td class="border p-2">11月11日</td><td class="border p-2">周三</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">感恩节</td><td class="border p-2">11月26日</td><td class="border p-2">周四</td><td class="border p-2">11月第四个周四</td></tr>
          <tr><td class="border p-2">圣诞节</td><td class="border p-2">12月25日</td><td class="border p-2">周五</td><td class="border p-2">—</td></tr>
        </tbody>
      </table>
      <p><strong>注意</strong>：2026 年独立日（7月4日）落在周六。联邦雇员将获得 7月3日（周五）作为调休日，多数私人企业也如此安排，形成 7/3-7/5 三天长周末。</p>

      <h2>2027 年美国联邦假日完整清单</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">假日</th><th class="border p-2">2027 日期</th><th class="border p-2">星期</th><th class="border p-2">备注</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">元旦</td><td class="border p-2">1月1日</td><td class="border p-2">周五</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">马丁·路德·金纪念日</td><td class="border p-2">1月18日</td><td class="border p-2">周一</td><td class="border p-2">1月第三个周一</td></tr>
          <tr><td class="border p-2">总统日（华盛顿诞辰）</td><td class="border p-2">2月15日</td><td class="border p-2">周一</td><td class="border p-2">2月第三个周一</td></tr>
          <tr><td class="border p-2">阵亡将士纪念日</td><td class="border p-2">5月31日</td><td class="border p-2">周一</td><td class="border p-2">5月最后一个周一</td></tr>
          <tr><td class="border p-2">六月节（Juneteenth）</td><td class="border p-2">6月18日</td><td class="border p-2">周五</td><td class="border p-2">⚠️ 6月19日（周六）→ 调休至18日</td></tr>
          <tr><td class="border p-2">独立日</td><td class="border p-2">7月5日</td><td class="border p-2">周一</td><td class="border p-2">⚠️ 7月4日（周日）→ 调休至5日</td></tr>
          <tr><td class="border p-2">劳动节</td><td class="border p-2">9月6日</td><td class="border p-2">周一</td><td class="border p-2">9月第一个周一</td></tr>
          <tr><td class="border p-2">哥伦布日（原住民日）</td><td class="border p-2">10月11日</td><td class="border p-2">周一</td><td class="border p-2">10月第二个周一</td></tr>
          <tr><td class="border p-2">退伍军人节</td><td class="border p-2">11月11日</td><td class="border p-2">周四</td><td class="border p-2">—</td></tr>
          <tr><td class="border p-2">感恩节</td><td class="border p-2">11月25日</td><td class="border p-2">周四</td><td class="border p-2">11月第四个周四</td></tr>
          <tr><td class="border p-2">圣诞节</td><td class="border p-2">12月24日</td><td class="border p-2">周五</td><td class="border p-2">⚠️ 12月25日（周六）→ 调休至24日</td></tr>
        </tbody>
      </table>
      <p><strong>2027 特殊说明</strong>：这一年有 3 个假日需要调休（六月节、独立日、圣诞节），其中 7月4日（周日）调休至 7月5日（周一），恰好形成连续 3 天长周末。</p>

      <h2>调休规则：假日落在周末怎么办</h2>
      <p>美国联邦假日有一个固定规则：<strong>假日落在周六，则周五调休；假日落在周日，则下周一调休</strong>。这条规则决定了"实际放假日"与"日历上的假日"可能不一致，也是安排出行、请假时最容易踩的坑。</p>

      <h2>2026-2027 年最佳长周末攻略</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">年份</th><th class="border p-2">长周末</th><th class="border p-2">怎么凑</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">2026</td><td class="border p-2">1月16-19（3天）</td><td class="border p-2">MLK Day（周一）</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">5月23-25（3天）</td><td class="border p-2">阵亡将士纪念日（周一）</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">7月3-5（3天）</td><td class="border p-2">独立日调休（周五）+ 周末</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">11月26-29（4天）</td><td class="border p-2">感恩节（周四）+ 请1天假（周五）</td></tr>
          <tr><td class="border p-2">2026</td><td class="border p-2">12月25-27（3天）</td><td class="border p-2">圣诞节（周五）</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">7月3-5（3天）</td><td class="border p-2">独立日调休（周一）</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">11月25-28（4天）</td><td class="border p-2">感恩节（周四）+ 请1天假（周五）</td></tr>
          <tr><td class="border p-2">2027</td><td class="border p-2">12月24-26（3天）</td><td class="border p-2">圣诞节调休（周五）</td></tr>
        </tbody>
      </table>
      <p><strong>最划算的一招</strong>：感恩节那周请 1 天假（周五），就能把 4 天连成长假；再请下周一，就是 5 天。</p>

      <h2>把假日同步到你的日历</h2>
      <p>与其每年手动查日期，不如打开 <a href="https://public-holidays.shop">PubHoliday</a>，选择 <strong>United States</strong>，一键订阅 ICS 日历——Google、Apple、Outlook 日历自动更新，永不遗漏。</p>
    `,
  },
  {
    id: 111,
    title: "UK Bank Holidays Explained: England, Scotland & Northern Ireland",
    slug: "uk-bank-holidays-explained",
    category: "guide",
    author: "PubHoliday Research Team",
    publishedDate: "2026-08-05T08:00:00Z",
    lastModified: "2026-08-05T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.svg",
    excerpt: "England, Scotland and Northern Ireland each have different bank holidays. The full breakdown for 2026, including regional differences and long-weekend planning.",
    relatedCountries: ["GB"],
    locale: "en",
    content: `
      <p>UK bank holidays aren't like ordinary holidays — they're defined by law, and England, Scotland and Northern Ireland each have different schedules.</p>
      <h2>What are bank holidays?</h2>
      <p>Bank holidays are statutory public holidays in the UK, rooted in the 1871 Bank Holidays Act. Despite the name, they apply nationwide — banks close, and so do most businesses and schools.</p>
      <h2>Regional differences (the key part)</h2>
      <ul>
        <li><strong>England:</strong> New Year, Good Friday, Easter Monday, May and Spring bank holidays, Summer (late Aug), Christmas, Boxing Day.</li>
        <li><strong>Scotland:</strong> New Year, Good Friday (no Easter Monday), May and Spring bank holidays, Summer (early Aug), St Andrew's Day (Nov 30), Christmas, Boxing Day.</li>
        <li><strong>Northern Ireland:</strong> All of England's holidays plus St Patrick's Day (Mar 17).</li>
      </ul>
      <h2>2026 UK public holidays (summary)</h2>
      <ul>
        <li>Jan 1: New Year's Day</li>
        <li>Apr 3: Good Friday</li>
        <li>Apr 6: Easter Monday (England & NI)</li>
        <li>May 4: Early May bank holiday</li>
        <li>May 25: Spring bank holiday</li>
        <li>Aug 3 (Scotland) / Aug 31 (England & NI): Summer bank holiday</li>
        <li>Dec 25: Christmas Day</li>
        <li>Dec 28: Boxing Day (substitute)</li>
      </ul>
      <h2>Planning long weekends</h2>
      <p>Combine holidays with weekends: England's Aug 31 (Mon) holiday means Aug 29-31 is a 3-day break. Use our <a href="https://public-holidays.shop">holiday planner</a> to see long-weekend combos for any country.</p>
      <h2>FAQ</h2>
      <ul>
        <li><strong>Are bank holidays and public holidays different?</strong> Used interchangeably; both trace to bank holiday legislation.</li>
        <li><strong>Why is Scotland different?</strong> Scotland has its own legal system; its parliament sets holiday arrangements.</li>
        <li><strong>What if a holiday falls on a weekend?</strong> It rolls to the next working day (a "substitute day").</li>
      </ul>
    `,
  },
  {
    id: 112,
    title: "英国银行假日全解析：英格兰、苏格兰与北爱尔兰",
    slug: "uk-bank-holidays-explained",
    category: "guide",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-08-05T08:00:00Z",
    lastModified: "2026-08-05T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/uk-bank-holidays.svg",
    excerpt: "英格兰、苏格兰、北爱尔兰的银行假日各不相同。2026 年完整拆解：各地区差异 + 长周末规划。",
    relatedCountries: ["GB"],
    locale: "zh",
    content: `
      <p>英国的"银行假日"和普通节假日不一样——它由法律定义，而且英格兰、苏格兰、北爱尔兰各有不同的安排。</p>
      <h2>什么是银行假日？</h2>
      <p>银行假日是英国法定的公众假日，起源于 1871 年《银行假日法》。名字虽叫"银行"，但它适用于全国——银行放假，大多数企业和学校也放假。</p>
      <h2>三地差异（关键）</h2>
      <ul>
        <li><strong>英格兰：</strong>元旦、耶稣受难日、复活节星期一、五月/春季银行假日、夏季（8月末）、圣诞节、节礼日。</li>
        <li><strong>苏格兰：</strong>元旦、耶稣受难日（无复活节星期一）、五月/春季银行假日、夏季（8月初）、圣安德鲁日（11/30）、圣诞节、节礼日。</li>
        <li><strong>北爱尔兰：</strong>全部英格兰假日 + 圣帕特里克节（3/17）。</li>
      </ul>
      <h2>2026 年英国公共假日（简表）</h2>
      <ul>
        <li>1月1日：元旦</li>
        <li>4月3日：耶稣受难日</li>
        <li>4月6日：复活节星期一（英格兰&北爱）</li>
        <li>5月4日：五月银行假日</li>
        <li>5月25日：春季银行假日</li>
        <li>8月3日（苏格兰）/ 8月31日（英格兰&北爱）：夏季银行假日</li>
        <li>12月25日：圣诞节</li>
        <li>12月28日：节礼日（顺延）</li>
      </ul>
      <h2>怎么规划长周末？</h2>
      <p>把假日和周末拼起来：英格兰 8 月 31 日（周一）假日 → 8 月 29-31 日连休 3 天。用 <a href="https://public-holidays.shop">假日规划工具</a> 查看任意国家的长周末组合。</p>
      <h2>常见问题</h2>
      <ul>
        <li><strong>"银行假日"和"公共假日"有区别吗？</strong> 术语上通用，法律依据都是银行假日法体系。</li>
        <li><strong>苏格兰为什么不一样？</strong> 苏格兰有独立法律体系，假日安排由议会决定。</li>
        <li><strong>假日正好在周末怎么办？</strong> 会顺延到下一个工作日（称为 "substitute day"）。</li>
      </ul>
    `,
  },
  {
    id: 113,
    title: "Canada Statutory Holidays: Federal vs Provincial, Explained",
    slug: "canada-statutory-holidays-federal-vs-provincial",
    category: "guide",
    author: "PubHoliday Research Team",
    publishedDate: "2026-08-06T08:00:00Z",
    lastModified: "2026-08-06T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/canada-statutory-holidays.svg",
    excerpt: "Canada has 5 nationwide statutory holidays, but provinces add their own — here's the full federal vs provincial breakdown for 2026 and 2027.",
    relatedCountries: ["CA"],
    locale: "en",
    faq: [
      { question: "How many statutory holidays does Canada have?", answer: "5 federal statutory holidays for federally regulated employees: New Year's Day, Good Friday, Canada Day, Labour Day, Christmas Day. Provinces add 4-8 more (e.g., Ontario has 9 total, Quebec 8)." },
      { question: "Which holidays are federally recognized in Canada?", answer: "New Year's Day (Jan 1), Good Friday, Canada Day (Jul 1), Labour Day (1st Mon of Sep), Christmas Day (Dec 25)." },
      { question: "Why do Canadian provinces have different holidays?", answer: "Labour law is mostly provincial in Canada. Each province legislates its own statutory holidays for most workers, while federal employees follow the federal list." },
      { question: "Is Family Day a statutory holiday?", answer: "In most provinces yes — BC, Alberta, Ontario, Saskatchewan, New Brunswick, and others observe Family Day on the 3rd Monday of February (dates vary by province)." },
      { question: "What are the national holidays in Canada?", answer: "The 5 nationwide holidays: New Year's Day, Good Friday, Canada Day, Labour Day, Christmas Day. Most provinces also include Victoria Day in May." },
    ],
    content: `
      <p>Canada's <strong>statutory holidays</strong> system has two layers: <strong>federal holidays</strong> that apply to federally regulated employees nationwide, and <strong>provincial holidays</strong> that each province legislates for most workers. This guide breaks down the 2026 and 2027 calendars so you never miss a <strong>Canadian public holiday</strong>.</p>

      <h2>Federal vs Provincial: The Two-Layer System</h2>
      <p><strong>Federal statutory holidays (5):</strong> New Year's Day, Good Friday, Canada Day, Labour Day, Christmas Day — these apply to federal employees and federally regulated industries (banks, airlines, telecom).</p>
      <p><strong>Provincial statutory holidays:</strong> Each province and territory adds its own. Ontario recognizes 9, Quebec 8, British Columbia 10. That's why a <strong>Canadian holiday by province</strong> can look very different.</p>

      <h2>Canada's National Holidays 2026-2027</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">Holiday</th><th class="border p-2">2026 Date</th><th class="border p-2">2027 Date</th><th class="border p-2">Scope</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">New Year's Day</td><td class="border p-2">Jan 1</td><td class="border p-2">Jan 1</td><td class="border p-2">Nationwide</td></tr>
          <tr><td class="border p-2">Good Friday</td><td class="border p-2">Apr 3</td><td class="border p-2">Mar 26</td><td class="border p-2">Nationwide</td></tr>
          <tr><td class="border p-2">Victoria Day</td><td class="border p-2">May 18</td><td class="border p-2">May 24</td><td class="border p-2">Most provinces</td></tr>
          <tr><td class="border p-2">Canada Day</td><td class="border p-2">Jul 1</td><td class="border p-2">Jul 1</td><td class="border p-2">Nationwide</td></tr>
          <tr><td class="border p-2">Labour Day</td><td class="border p-2">Sep 7</td><td class="border p-2">Sep 6</td><td class="border p-2">Nationwide</td></tr>
          <tr><td class="border p-2">Thanksgiving</td><td class="border p-2">Oct 12</td><td class="border p-2">Oct 11</td><td class="border p-2">Most provinces</td></tr>
          <tr><td class="border p-2">Remembrance Day</td><td class="border p-2">Nov 11</td><td class="border p-2">Nov 11</td><td class="border p-2">Many provinces</td></tr>
          <tr><td class="border p-2">Christmas Day</td><td class="border p-2">Dec 25</td><td class="border p-2">Dec 25</td><td class="border p-2">Nationwide</td></tr>
        </tbody>
      </table>

      <h2>Canadian Holidays by Province (2026)</h2>
      <ul>
        <li><strong>Ontario (9):</strong> Family Day (Feb 16), Victoria Day, Canada Day, Civic Holiday (Aug 3), Labour Day, Thanksgiving, Remembrance Day, Christmas, Boxing Day</li>
        <li><strong>Quebec (8):</strong> Good Friday (some also Easter Monday), National Patriots' Day (May 18), St-Jean-Baptiste (Jun 24), Canada Day, Labour Day, Thanksgiving, Christmas</li>
        <li><strong>British Columbia (10):</strong> Family Day, Victoria Day, Canada Day, BC Day (Aug 3), Labour Day, Truth and Reconciliation (Sep 30), Thanksgiving, Remembrance Day, Christmas, Boxing Day</li>
        <li><strong>Alberta (9):</strong> Family Day, Victoria Day, Canada Day, Heritage Day (Aug 3), Labour Day, Thanksgiving, Remembrance Day, Christmas, Boxing Day</li>
      </ul>

      <h2>When a Holiday Falls on a Weekend</h2>
      <p>Most provinces observe <strong>in-lieu rules</strong>: a holiday landing on Saturday or Sunday shifts to the nearest weekday so workers still get the day off. Check the exact observance date for your province before booking travel.</p>

      <h2>Plan Around Canadian Holidays</h2>
      <p>Use PubHoliday to see <a href="https://public-holidays.shop/en/CA">Canada public holidays 2026</a> for any province, sync them to your calendar, and spot long-weekend combinations months ahead.</p>
    `,
  },
  {
    id: 114,
    title: "加拿大法定假日：联邦与各省差异全解析",
    slug: "canada-statutory-holidays-federal-vs-provincial",
    category: "guide",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-08-06T08:00:00Z",
    lastModified: "2026-08-06T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/canada-statutory-holidays.svg",
    excerpt: "加拿大法定假日分两层：联邦 5 个全国假日 + 各省自定假日。2026-2027 完整日历与各省差异一次讲清。",
    relatedCountries: ["CA"],
    locale: "zh",
    content: `
      <p>加拿大的<strong>法定假日</strong>体系分两层：<strong>联邦假日</strong>适用于全国受联邦监管的员工（银行、航空、电信），<strong>省级假日</strong>由各省自己立法，覆盖大多数劳动者。这份指南把 2026-2027 的日历和各省差异讲清楚。</p>
      <h2>联邦 vs 省级：两层体系</h2>
      <p><strong>联邦法定假日（5 个）：</strong>元旦、耶稣受难日、加拿大日、劳动节、圣诞节。</p>
      <p><strong>省级法定假日：</strong>每个省在联邦基础上加自己的假日——安大略共 9 个、魁北克 8 个、不列颠哥伦比亚 10 个。这就是为什么"加拿大假日"按省看差别很大。</p>
      <h2>加拿大全国假日 2026-2027</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">假日</th><th class="border p-2">2026 日期</th><th class="border p-2">2027 日期</th><th class="border p-2">范围</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">元旦</td><td class="border p-2">1月1日</td><td class="border p-2">1月1日</td><td class="border p-2">全国</td></tr>
          <tr><td class="border p-2">耶稣受难日</td><td class="border p-2">4月3日</td><td class="border p-2">3月26日</td><td class="border p-2">全国</td></tr>
          <tr><td class="border p-2">维多利亚日</td><td class="border p-2">5月18日</td><td class="border p-2">5月24日</td><td class="border p-2">多数省份</td></tr>
          <tr><td class="border p-2">加拿大日</td><td class="border p-2">7月1日</td><td class="border p-2">7月1日</td><td class="border p-2">全国</td></tr>
          <tr><td class="border p-2">劳动节</td><td class="border p-2">9月7日</td><td class="border p-2">9月6日</td><td class="border p-2">全国</td></tr>
          <tr><td class="border p-2">感恩节</td><td class="border p-2">10月12日</td><td class="border p-2">10月11日</td><td class="border p-2">多数省份</td></tr>
          <tr><td class="border p-2">国殇日</td><td class="border p-2">11月11日</td><td class="border p-2">11月11日</td><td class="border p-2">多数省份</td></tr>
          <tr><td class="border p-2">圣诞节</td><td class="border p-2">12月25日</td><td class="border p-2">12月25日</td><td class="border p-2">全国</td></tr>
        </tbody>
      </table>
      <h2>各省假日差异（2026）</h2>
      <ul>
        <li><strong>安大略（9 个）：</strong>家庭日（2/16）、维多利亚日、加拿大日、市民假日（8/3）、劳动节、感恩节、国殇日、圣诞节、节礼日</li>
        <li><strong>魁北克（8 个）：</strong>耶稣受难日（部分人还休复活节周一）、爱国者日（5/18）、施洗约翰日（6/24）、加拿大日、劳动节、感恩节、圣诞节</li>
        <li><strong>不列颠哥伦比亚（10 个）：</strong>家庭日、维多利亚日、加拿大日、BC 日（8/3）、劳动节、真相与和解日（9/30）、感恩节、国殇日、圣诞节、节礼日</li>
        <li><strong>阿尔伯塔（9 个）：</strong>家庭日、维多利亚日、加拿大日、遗产日（8/3）、劳动节、感恩节、国殇日、圣诞节、节礼日</li>
      </ul>
      <h2>假日碰到周末怎么办</h2>
      <p>多数省份有<strong>顺延规则</strong>：假日落在周六/周日时，会顺延到最近的工作日。出行前先查你所在省的"实际放假日期"。</p>
      <h2>用加拿大假日做规划</h2>
      <p>用 PubHoliday 查看<a href="https://public-holidays.shop/zh/CA">加拿大公共假日 2026</a>任意省份的日历，一键同步到你的日历，提前发现长周末组合。</p>
    `,
  },

  {
    id: 100,
    title: "The Complete Guide to Planning Your Year Around Public Holidays",
    slug: "complete-guide-planning-around-public-holidays",
    category: "guide",
    author: "Editorial Team",
    publishedDate: "2026-08-06T09:00:00Z",
    lastModified: "2026-08-06T09:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/planning-guide.svg",
    excerpt: "A practical, month-by-month framework for using public holiday calendars to plan vacations, payroll, and family time without the usual guesswork.",
    relatedCountries: ["US", "GB", "DE", "CN"],
    locale: "en",
    content: `
      <p>Public holidays shape far more than a single day off. They decide when schools close, when payroll must be run, when factories pause, and when millions of people travel at once. Yet most people plan around holidays reactively — they discover a closure only when it is already too late to book a cheaper flight or schedule a shipment. This guide gives you a repeatable framework for planning an entire year around public holidays, whether you are organizing family trips, managing a team, or running a small business.</p>

      <h2>Why Planning Around Holidays Pays Off</h2>
      <p>The biggest wins come from two patterns. First, <strong>bridging</strong>: when a holiday falls on a Tuesday or Thursday, taking one or two adjacent vacation days turns a single day off into a four- or five-day break. Second, <strong>avoiding surge periods</strong>: travel, hotels, and shipping all spike in price and delay around major holidays. Knowing the calendar a year ahead lets you book before the curve.</p>
      <ul>
        <li><strong>Cost:</strong> Flights booked 3-6 months ahead of a holiday window are routinely 30-60% cheaper than last-minute fares.</li>
        <li><strong>Operations:</strong> Manufacturers and logistics teams that pre-stage inventory before a holiday closure avoid stockouts that last a week or more.</li>
        <li><strong>Wellbeing:</strong> Employees who can predict their time off plan rest properly instead of fragmenting it.</li>
      </ul>

      <h2>How Holiday Calendars Differ by Country</h2>
      <p>No two countries count holidays the same way. The United States has ten federal holidays but states and private employers vary widely. The United Kingdom splits bank holidays between England & Wales, Scotland, and Northern Ireland. Germany layers nine national holidays under a varying number of state holidays. China concentrates its paid leave into a few golden-week clusters. Japan blends fixed dates with the elegant <em>furikae</em> rule that shifts a holiday to Monday when it lands on a Sunday.</p>
      <p>If you work across borders, the safest habit is to maintain a per-country calendar rather than a single global list. A holiday that is a normal working day in one market may be a full shutdown in another.</p>

      <h2>A Month-by-Month Planning Framework</h2>
      <p>You do not need a complex tool to start. Open a spreadsheet with one column per country you care about and one row per week of the year. Mark each public holiday, then highlight the bridge opportunities — the holidays adjacent to a weekend. Review it once a quarter and adjust.</p>
      <ul>
        <li><strong>Q1:</strong> New Year clusters (Jan 1-2 in many countries), Lunar New Year in East Asia, and late-winter holidays. Plan annual leave here before budgets reset.</li>
        <li><strong>Q2:</strong> Easter is the movable anchor — Good Friday, Easter Monday, and associated spring holidays shift every year. Build logistics around the computed date, not a fixed assumption.</li>
        <li><strong>Q3:</strong> Summer bank holidays and independence-day periods. This is peak travel; book transport early.</li>
        <li><strong>Q4:</strong> Thanksgiving, Christmas, and New Year create the longest continuous closures in the Western calendar. Manufacturing and e-commerce must pre-build inventory by late October.</li>
      </ul>

      <h2>Bridging Holidays for Longer Breaks</h2>
      <p>A holiday on a Tuesday means Monday and Wednesday are the bridge days. Taking those two days off yields a five-day weekend from Saturday to Wednesday. A holiday on Thursday bridges backwards to Wednesday. Map these in your spreadsheet and propose them to your team or family as a package rather than deciding day by day.</p>
      <p>One caution: in some countries a <em>substitute day</em> (or "in lieu" day) is granted when a holiday falls on a weekend. Plan around the substitute date, not the calendar date, or you will miscalculate the bridge.</p>

      <h2>Holiday Planning for Payroll and HR</h2>
      <p>For employers, holiday planning is operational, not just cultural. In many European countries, holiday pay is legally distinct from ordinary pay, and working on a public holiday can trigger premium rates or time-off-in-lieu. Communicate the year's holiday schedule to payroll by the preceding December so rosters, on-call rotations, and statutory pay calculations are ready.</p>
      <ul>
        <li>Publish the holiday calendar internally before the year starts.</li>
        <li>Flag fixed-date holidays that fall on weekends for substitute-day handling.</li>
        <li>Reconcile cross-border teams: a holiday in one office is a normal day elsewhere.</li>
      </ul>

      <h2>Tools That Make This Effortless</h2>
      <p>You can build the spreadsheet yourself, but a maintained public holiday calendar removes the research burden. Our <a href="https://public-holidays.shop">country pages</a> list every official holiday per nation with dates, types, and long-weekend flags, and our long-weekend guide highlights the best bridge opportunities automatically. Use it as the source of truth, then copy the dates into your planning sheet.</p>

      <h2>Frequently Asked Questions</h2>
      <p><strong>How far ahead should I plan?</strong> At least one full year. Holiday dates for fixed-date countries are known years in advance; for movable holidays like Easter, compute them from the lunar or ecclesiastical rules and lock the schedule by December.</p>
      <p><strong>What is the difference between a public holiday and a bank holiday?</strong> In the UK, "bank holiday" is the legal term for a public holiday when banks and many businesses close. The terms are often used interchangeably, but bank holidays are a subset defined by statute.</p>
      <p><strong>Do substitute days apply everywhere?</strong> No. The United Kingdom, Japan, and several others grant substitute days; the United States generally does not move federal holidays and instead observes them on the nearest weekday only when the date itself is a Saturday or Sunday.</p>
      <p><strong>How do I plan for a remote team across countries?</strong> Keep one calendar per country, mark each team's local holidays, and treat cross-border coordination days as the intersection of everyone's working days.</p>
    `,
  }
];

// ========================================================================
// Locale-aware helper functions
// ========================================================================

/**
 * Get a single post by slug and optional locale.
 * Falls back to "en" if no locale match found.
 */
export function getPostData(slug: string, locale?: string): BlogPost | undefined {
  if (locale) {
    const post = BLOG_POSTS.find(
      (p) => p.slug === slug && (p.locale || "en") === locale
    );
    if (post) return post;
  }
  // Fallback: return any post with this slug (prefer "en")
  return BLOG_POSTS.find((p) => p.slug === slug && (p.locale || "en") === "en");
}

/**
 * Get posts filtered by category and optional locale.
 */
export function getPostsByCategory(category: string, locale?: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => {
    const matchCategory = p.category === category;
    const matchLocale = locale ? (p.locale || "en") === locale : true;
    return matchCategory && matchLocale;
  });
}

/**
 * Get all posts filtered by locale.
 */
export function getAllPosts(locale?: string): BlogPost[] {
  if (!locale) return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => (p.locale || "en") === locale);
}



export function getCategories(locale?: string): string[] {
  const posts = locale ? getAllPosts(locale) : BLOG_POSTS;
  return [...new Set(posts.map((p) => p.category))];
}

/**
 * Get posts by related country code and optional locale.
 */
export function getPostsByCountry(countryCode: string, locale?: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => {
    const matchCountry = p.relatedCountries.includes(countryCode);
    const matchLocale = locale ? (p.locale || "en") === locale : true;
    return matchCountry && matchLocale;
  });
}
