import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCountry } from "@/lib/countries";
import { getPostData, getPostsByCategory } from "@/lib/blog-posts";
import { articleBreadcrumb, articleStructuredData, faqPage } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import SubscribeButton from "@/components/SubscribeButton";
import AdSlot from "@/components/AdSlot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 604800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  // In production, fetch actual post data from CMS
  const post = await getPostData(slug, locale);

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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");

  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const localeStr = locale || "en";

  const relatedPosts = getPostsByCategory(category, locale).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-brand hover:underline">
            {tNav("home")}
          </Link>
          <span>/</span>
          <Link href="/blog" className="text-brand hover:underline">
            {t("blogSection")}
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
            <span>{t("byAuthor", { author: post.author })}</span>
            <span>•</span>
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString(localeStr, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{t("categoryLabel", { category: post.category })}</span>
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
                {t("shareTwitter")}
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `${SITE_URL}/${localeStr}/blog/${category}/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-800 text-white rounded-sm hover:bg-blue-900 transition-colors"
              >
                {t("shareLinkedIn")}
              </a>
              <a
                href={`https://api.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${SITE_URL}/${localeStr}/blog/${category}/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-sm hover:bg-blue-800 transition-colors"
              >
                {t("shareFacebook")}
              </a>
          </div>
        </div>

        {/* Related Countries — internal links to country holiday pages */}
        {post.relatedCountries.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">{t("relatedCountries")}</h3>
            <div className="flex flex-wrap gap-2">
              {post.relatedCountries.map((code) => {
                const c = getCountry(code);
                if (!c) return null;
                return (
                  <Link
                    key={code}
                    href={`/${code}`}
                    className="px-3 py-1.5 bg-[var(--brand)]/10 text-sm rounded-sm hover:bg-[var(--brand)]/20 transition-colors"
                  >
                    {t("relatedCountryLink", { name: c.name })}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

          {/* FAQ — captures "People Also Ask" intent + FAQPage rich snippet */}
          {post.faq && post.faq.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-4">{t("faqHeading")}</h2>
              <div className="space-y-4">
                {post.faq.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-1">{item.question}</h3>
                    <p className="text-[var(--muted)] leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">{t("relatedArticles")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.category}/${rp.slug}`} className="block p-4 border rounded-lg hover:border-brand transition-colors">
                <div className="text-xs text-[var(--muted)] mb-1">
                  {rp.category} · {new Date(rp.publishedDate).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <h4 className="text-sm font-semibold leading-tight mb-1">{rp.title}</h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2">{rp.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

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
            articleBreadcrumb(category, post.title, locale)
          ),
        }}
      />

      {post.faq && post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPage(post.faq)),
          }}
        />
      )}

      <AdSlot />
      <SubscribeButton
        country=""
        label={t("subscribeNewsletter")}
        hint={t("subscribeNewsletterHint")}
      />
    </div>
  );
}
