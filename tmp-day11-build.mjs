import fs from "fs";

const REPO = "C:/Users/l'x/WorkBuddy/2026-08-04-13-14-21/public-holidays";

// ---------------------------------------------------------------------------
// 1. Build the two BLOG_POSTS entries (en id 137, zh id 138)
// ---------------------------------------------------------------------------
const enContent = "`" + `
      <p>Sweden public holidays run on a system locals call "röda dagar," red days. If you've looked at a Swedish calendar and wondered why so many dates are printed in red, that's the whole answer: they're days off. This guide to sweden public holidays covers what red days mean, how the 2026 calendar falls, and which dates actually slow Swedish life down. Whether you're planning a trip, relocating, or just trying to figure out why the office is empty in June, the sweden holidays 2026 picture is worth a look.</p>

      <h2>What "red days" mean in Sweden</h2>
      <p>In Sweden, red days are public holidays, the official days when most people don't work. The name comes from old wall calendars, where Sundays and holy days were marked in red ink. The term stuck even after calendars went digital. Banks, schools, and most shops close, though you'll find supermarkets and tourist spots open in the big cities.</p>

      <h2>Sweden holidays 2026: the full red-day calendar</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">Holiday</th><th class="border p-2">2026 date</th><th class="border p-2">Weekday</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">New Year's Day</td><td class="border p-2">Jan 1</td><td class="border p-2">Thursday</td></tr>
          <tr><td class="border p-2">Epiphany</td><td class="border p-2">Jan 6</td><td class="border p-2">Tuesday</td></tr>
          <tr><td class="border p-2">Good Friday</td><td class="border p-2">Apr 3</td><td class="border p-2">Friday</td></tr>
          <tr><td class="border p-2">Easter Monday</td><td class="border p-2">Apr 6</td><td class="border p-2">Monday</td></tr>
          <tr><td class="border p-2">Labour Day</td><td class="border p-2">May 1</td><td class="border p-2">Friday</td></tr>
          <tr><td class="border p-2">Ascension Day</td><td class="border p-2">May 14</td><td class="border p-2">Thursday</td></tr>
          <tr><td class="border p-2">National Day</td><td class="border p-2">Jun 6</td><td class="border p-2">Saturday</td></tr>
          <tr><td class="border p-2">Midsummer's Day</td><td class="border p-2">Jun 20</td><td class="border p-2">Saturday</td></tr>
          <tr><td class="border p-2">All Saints' Day</td><td class="border p-2">Oct 31</td><td class="border p-2">Saturday</td></tr>
          <tr><td class="border p-2">Christmas Day</td><td class="border p-2">Dec 25</td><td class="border p-2">Friday</td></tr>
          <tr><td class="border p-2">Boxing Day</td><td class="border p-2">Dec 26</td><td class="border p-2">Saturday</td></tr>
        </tbody>
      </table>
      <p>Midsummer and National Day are the two that catch visitors off guard. Both land on weekends in 2026, which means no extra day off, but Swedes take the surrounding days anyway.</p>

      <h2>svenska helgdagar: the names you'll hear</h2>
      <p>Swedes use the Swedish names in daily life. "Nyårsdagen" (New Year), "långfredagen" (Good Friday), "kristi himmelsfärdsdag" (Ascension), and "midsommar" come up most. If a friend says "vi ses efter midsommar," they mean after the midsummer break, which for many stretches into the first week of July.</p>

      <h2>midsommar and the holidays Swedes actually care about</h2>
      <p>Ask a Swede about holidays and midsommar comes up first. It's not the biggest on paper, but it's the one people travel home for. Falling on the Saturday between June 19 and 25, Midsummer's Day in 2026 is June 20, and offices empty out the Friday before. Christmas is the other heavyweight: Swedes celebrate on December 24, not the 25th, so the red days on the 25th and 26th just extend the break.</p>

      <h2>How red days become long weekends (klämdagar)</h2>
      <p>Swedes are good at stretching a single red day. When a holiday lands on a Thursday, the Friday between it and the weekend is often taken as a "klämdag," a squeeze day. Ascension Day on May 14, 2026 is a clear example: most people take May 15 off and get a four-day weekend. The reverse happens too, a red day on a Tuesday can swallow the Monday before it.</p>

      <h2>Planning around Sweden's public holidays</h2>
      <p>If you're visiting, build your trip around the gaps. Late June is quiet for business but full of local events. Early May and late May both offer long weekends. Don't assume everything reopens the day after a red day. In small towns, shops can stay closed right through a klämdag.</p>

      <h2>FAQ</h2>
      <p><strong>Are shops open on red days in Sweden?</strong> Large supermarkets and city-centre stores usually open on red days, especially in Stockholm and Gothenburg. Smaller towns often close completely, and almost everything shuts on Christmas Day and Midsummer's Day.</p>
      <p><strong>How many public holidays does Sweden have?</strong> Sweden has 11 official public holidays, its red days. That puts it around the middle of the European range, fewer than Spain and more than the Netherlands.</p>
      <p><strong>What is a klämdag?</strong> A klämdag is a squeeze day, a normal working day pinned between a holiday and a weekend. Many Swedes take it as leave to make a longer break.</p>
      <p><strong>Is Midsummer's Day a public holiday?</strong> Yes. Midsummer's Day, midsommar, is a public holiday, always on a Saturday, and one of the most observed red days of the year.</p>

      <p>Want the full picture? See the complete Sweden calendar on <a href="/en/SE">public-holidays.shop</a>, browse every country from the <a href="/en">homepage</a>, or read more guides in our <a href="/en/blog">blog</a>. public-holidays.shop keeps the dates straight so you don't have to.</p>
    ` + "`";

const zhContent = "`" + `
      <p>瑞典公共假日有一套本地人叫做"红日"(röda dagar)的说法。如果你看过瑞典的日历，会发现很多日期印成红色，那代表的就是放假。这篇关于瑞典公共假日的指南，讲清楚红日到底是什么意思、2026 年的日历怎么排，以及哪些日子真的会让瑞典人的生活慢下来。无论你是打算去旅游、准备搬家，还是只是想弄明白为什么六月办公室空荡荡，瑞典 2026 假日这张图都值得看一眼。</p>

      <h2>"红日"在瑞典到底指什么</h2>
      <p>在瑞典，红日就是公共假日，是大多数人不工作的官方日子。名字来自老式挂历：星期天和宗教节日用红墨水标。现在日历都数字化了，这个词却留了下来。银行、学校、大部分商店都会关门，不过大城市里的超市和旅游区通常还开着。</p>

      <h2>瑞典 2026 假日：完整的红日日历</h2>
      <table class="min-w-full border-collapse border border-gray-300 mb-4">
        <thead><tr class="bg-gray-100"><th class="border p-2">假日</th><th class="border p-2">2026 日期</th><th class="border p-2">星期</th></tr></thead>
        <tbody>
          <tr><td class="border p-2">元旦</td><td class="border p-2">1 月 1 日</td><td class="border p-2">周四</td></tr>
          <tr><td class="border p-2">主显节</td><td class="border p-2">1 月 6 日</td><td class="border p-2">周二</td></tr>
          <tr><td class="border p-2">耶稣受难日</td><td class="border p-2">4 月 3 日</td><td class="border p-2">周五</td></tr>
          <tr><td class="border p-2">复活节周一</td><td class="border p-2">4 月 6 日</td><td class="border p-2">周一</td></tr>
          <tr><td class="border p-2">劳动节</td><td class="border p-2">5 月 1 日</td><td class="border p-2">周五</td></tr>
          <tr><td class="border p-2">耶稣升天节</td><td class="border p-2">5 月 14 日</td><td class="border p-2">周四</td></tr>
          <tr><td class="border p-2">国庆日</td><td class="border p-2">6 月 6 日</td><td class="border p-2">周六</td></tr>
          <tr><td class="border p-2">仲夏节</td><td class="border p-2">6 月 20 日</td><td class="border p-2">周六</td></tr>
          <tr><td class="border p-2">万圣节</td><td class="border p-2">10 月 31 日</td><td class="border p-2">周六</td></tr>
          <tr><td class="border p-2">圣诞节</td><td class="border p-2">12 月 25 日</td><td class="border p-2">周五</td></tr>
          <tr><td class="border p-2">节礼日</td><td class="border p-2">12 月 26 日</td><td class="border p-2">周六</td></tr>
        </tbody>
      </table>
      <p>仲夏节和国庆日最让游客意外。2026 年这两个都落在周末，所以没有额外补休，但瑞典人照样会把前后几天一起休掉。</p>

      <h2>svenska helgdagar：你会听到的瑞典语叫法</h2>
      <p>瑞典人日常用的是瑞典语名字。"Nyårsdagen"(元旦)、"långfredagen"(耶稣受难日)、"kristi himmelsfärdsdag"(升天节)，还有 "midsommar"(仲夏)，是最常出现的几个。如果朋友说"vi ses efter midsommar"，意思是过了仲夏假期再见，而对很多人来说，这个假期会一直拖到七月的头一周。</p>

      <h2>midsommar 和瑞典人真正看重的假日</h2>
      <p>跟瑞典人聊假日，最先冒出来的多半是仲夏节。它名义上不是最大的，却是大家愿意专门跑回家过的那个。仲夏节固定在 6 月 19 到 25 日之间的周六，2026 年是 6 月 20 日，前一天的周五办公室就空了。圣诞节是另一个重量级：瑞典人过的是 12 月 24 日而不是 25 日，所以 25、26 日这两个红日只是把假期拉得更长。</p>

      <h2>红日怎么变成长周末（klämdag）</h2>
      <p>瑞典人很会把单个红日抻长。如果假日落在周四，夹在它和周末之间的周五常被当作 "klämdag"，也就是"挤出来的日子"请掉。2026 年 5 月 14 日的耶稣升天节就是典型：多数人会请 5 月 15 日，凑成四天连休。反过来也一样：周二的红日可能把前面的周一一起吞掉。</p>

      <h2>围绕瑞典公共假日做计划</h2>
      <p>去旅游的话，最好顺着空档安排。六月底生意冷清但本地活动多。五月初和五月底都有长周末。别想当然以为红日的第二天一切照常，小镇常常连着 klämdag 一起关门。</p>

      <h2>FAQ</h2>
      <p><strong>瑞典红日商店开门吗？</strong> 大城市里的超市和市中心店铺通常开门，斯德哥尔摩、哥德堡尤其如此。小镇往往全关，圣诞节和仲夏节这两天几乎什么都不开。</p>
      <p><strong>瑞典有多少个公共假日？</strong> 瑞典有 11 个官方公共假日（红日），在欧洲大概居中，比西班牙少，比荷兰多。</p>
      <p><strong>klämdag 是什么意思？</strong> klämdag 是"挤出来的日子"，夹在假日和周末之间的正常工作日。很多瑞典人会请掉它，凑出更长的休息。</p>
      <p><strong>仲夏节是公共假日吗？</strong> 是。仲夏节（midsommar）是公共假日，永远落在周六，也是一年里最受重视的红日之一。</p>

      <p>想看全貌？去 <a href="/zh/SE">public-holidays.shop</a> 看完整瑞典日历，到 <a href="/zh">首页</a> 浏览所有国家，或者到 <a href="/zh/blog">博客</a> 读更多指南。public-holidays.shop 帮你把日期记准，省得自己算。</p>
    ` + "`";

const enEntry = `  {
    id: 137,
    title: "Sweden Public Holidays: What Red Days Mean",
    slug: "sweden-public-holidays",
    category: "guide",
    author: "PubHoliday Research Team",
    publishedDate: "2026-08-14T08:00:00Z",
    lastModified: "2026-08-14T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/sweden-public-holidays.svg",
    excerpt: "Sweden runs on red days (röda dagar). This guide explains what they mean, the full sweden holidays 2026 calendar, svenska helgdagar, midsommar, and how klämdagar turn single days into long weekends.",
    relatedCountries: ["SE"],
    locale: "en",
    faq: [
      { question: "Are shops open on red days in Sweden?", answer: "Large supermarkets and city-centre stores usually open on red days, especially in Stockholm and Gothenburg. Smaller towns often close completely, and almost everything shuts on Christmas Day and Midsummer's Day." },
      { question: "How many public holidays does Sweden have?", answer: "Sweden has 11 official public holidays, its red days. That puts it around the middle of the European range, fewer than Spain and more than the Netherlands." },
      { question: "What is a klaemdag?", answer: "A klaemdag is a squeeze day, a normal working day pinned between a holiday and a weekend. Many Swedes take it as leave to make a longer break." },
      { question: "Is Midsummer's Day a public holiday?", answer: "Yes. Midsummer's Day, midsommar, is a public holiday, always on a Saturday, and one of the most observed red days of the year." },
    ],
    content: ${enContent},
  },`;

const zhEntry = `  {
    id: 138,
    title: "瑞典公共假日：红日到底是什么意思",
    slug: "sweden-public-holidays",
    category: "guide",
    author: "PubHoliday 研究团队",
    publishedDate: "2026-08-14T08:00:00Z",
    lastModified: "2026-08-14T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/sweden-public-holidays.svg",
    excerpt: "瑞典人把公共假日叫红日(röda dagar)。这篇指南讲清红日是什么意思、瑞典 2026 假日完整日历、svenska helgdagar、midsommar，以及 klämdag 怎么把单日变成连休。",
    relatedCountries: ["SE"],
    locale: "zh",
    faq: [
      { question: "瑞典红日商店开门吗？", answer: "大城市里的超市和市中心店铺通常开门，斯德哥尔摩、哥德堡尤其如此。小镇往往全关，圣诞节和仲夏节这两天几乎什么都不开。" },
      { question: "瑞典有多少个公共假日？", answer: "瑞典有 11 个官方公共假日（红日），在欧洲大概居中，比西班牙少，比荷兰多。" },
      { question: "klämdag 是什么意思？", answer: "klämdag 是挤出来的日子，夹在假日和周末之间的正常工作日。很多瑞典人会请掉它，凑出更长的休息。" },
      { question: "仲夏节是公共假日吗？", answer: "是。仲夏节（midsommar）是公共假日，永远落在周六，也是一年里最受重视的红日之一。" },
    ],
    content: ${zhContent},
  },`;

const blogFile = REPO + "/src/lib/blog-posts.ts";
let src = fs.readFileSync(blogFile, "utf8");
const marker = "\n];";
const idx = src.lastIndexOf(marker);
if (idx === -1) throw new Error("could not find BLOG_POSTS closing ];");
const before = src.slice(0, idx);
const after = src.slice(idx);
const newTail = before.replace(/\n  },\s*$/, "\n  },\n" + enEntry + "\n" + zhEntry) + after;
fs.writeFileSync(blogFile, newTail, "utf8");
console.log("blog-posts.ts appended (en id 137, zh id 138)");

// ---------------------------------------------------------------------------
// 2. i18n gate: add missing blog-namespace keys to all 12 message JSONs
// ---------------------------------------------------------------------------
const i18nDir = REPO + "/src/i18n/messages";
const keys = ["shareTwitter", "shareLinkedIn", "shareFacebook", "faqHeading", "relatedArticles", "relatedCountryLink"];
const tr = {
  en: { shareTwitter: "Share on Twitter", shareLinkedIn: "Share on LinkedIn", shareFacebook: "Share on Facebook", faqHeading: "Frequently Asked Questions", relatedArticles: "Related Articles", relatedCountryLink: "See {name} holidays" },
  zh: { shareTwitter: "在 Twitter 上分享", shareLinkedIn: "在 LinkedIn 上分享", shareFacebook: "在 Facebook 上分享", faqHeading: "常见问题", relatedArticles: "相关文章", relatedCountryLink: "查看 {name} 的假日" },
  de: { shareTwitter: "Auf Twitter teilen", shareLinkedIn: "Auf LinkedIn teilen", shareFacebook: "Auf Facebook teilen", faqHeading: "Häufig gestellte Fragen", relatedArticles: "Ähnliche Artikel", relatedCountryLink: "{name} Feiertage ansehen" },
  fr: { shareTwitter: "Partager sur Twitter", shareLinkedIn: "Partager sur LinkedIn", shareFacebook: "Partager sur Facebook", faqHeading: "Questions fréquentes", relatedArticles: "Articles connexes", relatedCountryLink: "Voir les jours fériés de {name}" },
  es: { shareTwitter: "Compartir en Twitter", shareLinkedIn: "Compartir en LinkedIn", shareFacebook: "Compartir en Facebook", faqHeading: "Preguntas frecuentes", relatedArticles: "Artículos relacionados", relatedCountryLink: "Ver los días festivos de {name}" },
  it: { shareTwitter: "Condividi su Twitter", shareLinkedIn: "Condividi su LinkedIn", shareFacebook: "Condividi su Facebook", faqHeading: "Domande frequenti", relatedArticles: "Articoli correlati", relatedCountryLink: "Vedi le festività di {name}" },
  ja: { shareTwitter: "Twitterで共有", shareLinkedIn: "LinkedInで共有", shareFacebook: "Facebookで共有", faqHeading: "よくある質問", relatedArticles: "関連記事", relatedCountryLink: "{name}の祝日を見る" },
  ko: { shareTwitter: "Twitter에서 공유", shareLinkedIn: "LinkedIn에서 공유", shareFacebook: "Facebook에서 공유", faqHeading: "자주 묻는 질문", relatedArticles: "관련 글", relatedCountryLink: "{name} 공휴일 보기" },
  nl: { shareTwitter: "Delen op Twitter", shareLinkedIn: "Delen op LinkedIn", shareFacebook: "Delen op Facebook", faqHeading: "Veelgestelde vragen", relatedArticles: "Gerelateerde artikelen", relatedCountryLink: "Bekijk {name} feestdagen" },
  pt: { shareTwitter: "Compartilhar no Twitter", shareLinkedIn: "Compartilhar no LinkedIn", shareFacebook: "Compartilhar no Facebook", faqHeading: "Perguntas frequentes", relatedArticles: "Artigos relacionados", relatedCountryLink: "Ver feriados de {name}" },
  ru: { shareTwitter: "Поделиться в Twitter", shareLinkedIn: "Поделиться в LinkedIn", shareFacebook: "Поделиться в Facebook", faqHeading: "Часто задаваемые вопросы", relatedArticles: "Похожие статьи", relatedCountryLink: "Смотреть праздники {name}" },
  ar: { shareTwitter: "شارك على تويتر", shareLinkedIn: "شارك على لينكد إن", shareFacebook: "شارك على فيسبوك", faqHeading: "الأسئلة الشائعة", relatedArticles: "مقالات ذات صلة", relatedCountryLink: "عرض عطلات {name}" },
};

let added = 0;
for (const f of fs.readdirSync(i18nDir).filter((x) => x.endsWith(".json"))) {
  const path = i18nDir + "/" + f;
  const json = JSON.parse(fs.readFileSync(path, "utf8"));
  const lang = f.replace(".json", "");
  const t = tr[lang] || tr.en;
  json.blog = json.blog || {};
  for (const k of keys) {
    if (!(k in json.blog)) { json.blog[k] = t[k]; added++; }
  }
  fs.writeFileSync(path, JSON.stringify(json, null, 2) + "\n", "utf8");
}
console.log("i18n keys added:", added);
