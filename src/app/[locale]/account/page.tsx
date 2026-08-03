import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { getSubscriptionByEmail, isProActive } from "@/lib/subscriptions";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const tNav = await getTranslations("nav");
  const tAccount = await getTranslations("account");

  const session = await auth();
  const user = session?.user;

  let plan: "free" | "pro" = "free";
  let status: string | null = null;
  let currentPeriodEnd: string | null = null;

  if (user?.email) {
    const sub = await getSubscriptionByEmail(user.email);
    if (isProActive(sub)) {
      plan = "pro";
      status = sub?.status ?? null;
      currentPeriodEnd = sub?.currentPeriodEnd ?? null;
    }
  }

  return (
    <AccountClient
      user={
        user
          ? {
              name: user.name ?? null,
              email: user.email ?? null,
              image: user.image ?? null,
            }
          : null
      }
      plan={plan}
      status={status}
      currentPeriodEnd={currentPeriodEnd}
      navAccount={tNav("account")}
      signInPrompt={tAccount("signInPrompt")}
    />
  );
}
