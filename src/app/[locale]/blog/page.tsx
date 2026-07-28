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

  // Sample blog data — in production, this would come from a CMS or content directory
  const featuredPost = {
    title: "Top 10 Public Holidays in 2025 That Will Extend Your Long Weekends",
    excerpt: "Discover how to combine holidays with weekends for maximum time off.",
    category: "travel",
    author: "Sarah Johnson",
    publishedDate: "2025-01-15T08:00:00Z",
    imageUrl: "https://public-holidays.shop/images/blog/holiday-planning-2025.jpg",
  };

  const categories = [
    {
      id: "travel",
      name: "Travel",
      description: "Holidays for travelers and remote workers",
      count: 12,
    },
    {
      id: "work",
      name: "Work",
      description: "Holiday policies and remote work tips",
      count: 8,
    },
    {
      id: "culture",
      name: "Culture",
      description: "Cultural significance of holidays",
      count: 15,
    },
    {
      id: "finance",
      name: "Finance",
      description: "Holiday pay calculations and tax implications",
      count: 6,
    },
  ];

  const recentPosts = [
    {
      title: "How to Calculate Holiday Pay in Germany",
      category: "finance",
      author: "Michael Weber",
      publishedDate: "2025-02-20T10:30:00Z",
      excerpt: "Understanding German holiday pay laws for employees.",
    },
    {
      title: "UK Public Holidays and Bank Days Explained",
      category: "work",
      author: "Emma Thompson",
      publishedDate: "2025-03-05T09:15:00Z",
      excerpt: "A complete guide to UK bank holidays and how they work.",
    },
    {
      title: "Best European Cities for Holiday Travel in 2025",
      category: "travel",
      author: "Anna Schmidt",
      publishedDate: "2025-03-12T14:00:00Z",
      excerpt: "Top destinations for holiday travelers across Europe.",
    },
  ];

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
                  href={`/${locale}/blog/${featuredPost.category}/${encodeURIComponent(
                    featuredPost.title
                  )}`}
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
                  href={`/${locale}/blog/${post.category}/${encodeURIComponent(
                    post.title
                  )}`}
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
