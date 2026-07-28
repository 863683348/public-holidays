import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import AdSlot from "@/components/AdSlot";
import { getCountry } from "@/lib/countries";
import { getAllPosts, getCategories } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

// Revalidate daily to keep content fresh
export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
    },
    openGraph: {
      type: "website",
      siteName: "PubHoliday",
      title,
      description,
      url: `${SITE_URL}/${locale}/blog`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  // Fetch locale-aware blog data from the data store
  const allPosts = getAllPosts(locale);
  const categoryList = getCategories(locale);

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;

  const categories = categoryList.map((cat) => {
    const catPosts = allPosts.filter((p) => p.category === cat);
    const names: Record<string, string> = {
      data: "Data & Research",
      travel: "Travel",
      work: "Work",
      culture: "Culture",
      finance: "Finance",
    };
    const descriptions: Record<string, string> = {
      data: "Data-driven holiday research and global analysis",
      travel: "Holidays for travelers and remote workers",
      work: "Holiday policies and remote work tips",
      culture: "Cultural significance of holidays",
      finance: "Holiday pay calculations and tax implications",
    };
    return {
      id: cat,
      name: names[cat] || cat,
      description: descriptions[cat] || "Articles about " + cat,
      count: catPosts.length,
    };
  });

  const recentPosts = allPosts.slice(0, 3).map((p) => ({
    title: p.title,
    category: p.category,
    author: p.author,
    slug: p.slug,
    publishedDate: p.publishedDate,
    excerpt: p.excerpt,
  }));

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <h1 className="text-4xl font-bold mb-4">{t("heading")}</h1>
        <p className="text-lg text-[var(--muted)] mb-6">{t("subheading")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="px-6 py-2 bg-brand text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            {t("viewAll")}
          </Link>
          <SubscribeButton
            country=""
            label={t("subscribeNewsletter")}
            hint={t("subscribeNewsletterHint")}
          />
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("featured")}</h2>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-[var(--muted)] mb-2">
                {featuredPost.category} • {featuredPost.author}
              </div>
              <h3 className="text-lg font-semibold leading-tight mb-2">
                <Link
                  href={`/${locale}/blog/${featuredPost.category}/${featuredPost.slug}`}
                  className="hover:text-brand transition-colors"
                >
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="text-[var(--muted)] text-sm">{featuredPost.excerpt}</p>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">{t("categoriesHeading")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-6 hover:border-brand transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <span className="text-sm text-[var(--muted)]">{category.count} posts</span>
              </div>
              <p className="text-[var(--muted)] text-sm mb-4">{category.description}</p>
              <Link
                href={`/${locale}/blog/${category.id}`}
                className="text-sm text-brand hover:underline"
              >
                View all →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">{t("recentHeading")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <div key={post.title} className="space-y-3">
              <div className="text-sm text-[var(--muted)]">
                {post.category} • {post.author}
              </div>
              <h3 className="text-lg font-semibold leading-tight">
                <Link
                  href={`/${locale}/blog/${post.category}/${post.slug}`}
                  className="hover:text-brand transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-[var(--muted)] text-sm">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot />
    </div>
  );
}
