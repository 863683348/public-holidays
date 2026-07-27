import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getCountry } from "@/lib/countries";
import { getPostData } from "@/lib/blog-posts";
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
  const post = await getPostData(slug);

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
  const t = await getTranslations("blog");

  const post = await getPostData(slug);

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
                    href={`/${localeStr}/${code}`}
                    className="px-3 py-1.5 bg-[var(--brand)]/10 text-sm rounded-sm hover:bg-[var(--brand)]/20 transition-colors"
                  >
                    {c.name} Holidays →
                  </Link>
                );
              })}
            </div>
          </div>
        )}
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
