import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWaffo, WAFFO_PRODUCT_ID, isWaffoConfigured } from "@/lib/waffo";

// POST /api/checkout
// Creates a Waffo Pancake checkout session and returns the checkout URL.
// Use server-side redirect (res.redirect) on the client — do NOT window.open.
export async function POST(req: NextRequest) {
  if (!isWaffoConfigured) {
    return NextResponse.json(
      { error: "Waffo payment is not configured" },
      { status: 503 }
    );
  }

  const session = await auth();
  const user = session?.user;
  const buyerIdentity = user?.email ?? "anonymous";

  let requestedLocale = "en";
  try {
    const body = (await req.json()) as { locale?: string } | undefined;
    if (body?.locale && /^[a-z]{2}$/.test(body.locale)) {
      requestedLocale = body.locale;
    }
  } catch {
    // Body empty or invalid — fall back to default locale
  }

  try {
    const result = await getWaffo().checkout.authenticated.create({
      productId: WAFFO_PRODUCT_ID,
      currency: "USD",
      buyerIdentity,
      ...(user?.email ? { buyerEmail: user.email } : {}),
      metadata: {
        user_id: buyerIdentity,
        campaign: "pricing-page",
      },
      successUrl: new URL(
        `/${requestedLocale}/account?status=success`,
        req.nextUrl.origin
      ).toString(),
    });

    return NextResponse.json({ checkoutUrl: result.checkoutUrl });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
