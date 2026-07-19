import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import WorldClock from "@/components/WorldClock";

export default async function WorldClockPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("worldClock");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link href="/" className="text-sm text-[var(--brand)]">
          ←
        </Link>
      </div>
      <WorldClock />
    </div>
  );
}
