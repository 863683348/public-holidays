import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";
import AdSlot from "@/components/AdSlot";
import { getPostsByCategory } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://public-holidays.shop";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations("blog");

  const title = `${t("categoryTitle", { category })} — Blog`;
  const description = `Latest articles about ${category} at PubHoliday`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${category}`,
    },
    openGraph: {
      type: "website",
      siteName: "PubHoliday",
      title,
      description,
      url: `${SITE_URL}/${locale}/blog/${category}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const t = await getTranslations("blog");

  // Fetch locale-aware posts from data store
  const categoryPosts = getPostsByCategory(category, locale);

  if (categoryPosts.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-brand hover:underline"
        >
          {t("backToBlog")}
        </Link>
        <h1 className="text-3xl font-semibold mt-4 mb-2">
          {t("categoryTitle", { category })}
        </h1>
        <p className="text-[var(--muted)]">
          {t("categoryDescription", { category: category })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryPosts.map((post) => (
          <div key={post.id} className="border rounded-lg p-6 hover:border-brand transition-colors">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div className="text-sm text-[var(--muted)] mb-2">
              {post.category} • {post.author}
            </div>
            <h3 className="text-lg font-semibold leading-tight mb-2">
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

      <AdSlot />
    </div>
  );
}
