import { NextRequest, NextResponse } from "next/server";
import { getWaffo } from "@/lib/waffo";

// POST /api/webhooks/waffo
// Waffo Pancake webhook receiver — verify signature and process events.
// Events: order.completed, subscription.activated, subscription.canceled
// NOTE: subscription state persistence needs the DB layer (P1-0).
// For now we log + return 200. DB integration lands with Neon/Prisma.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-waffo-signature") ?? "";

  let event: unknown;
  try {
    event = getWaffo().webhooks.verify(rawBody, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = event as {
    type?: string;
    mode?: string;
    data?: Record<string, unknown>;
  };

  console.log("[waffo-webhook]", JSON.stringify({ type: data.type, mode: data.mode, data: data.data }));

  switch (data.type) {
    case "order.completed":
      // Payment succeeded — grant Pro access (persist to DB when P1-0 lands)
      break;
    case "subscription.activated":
      // Subscription started/renewed
      break;
    case "subscription.canceled":
      // Subscription canceled — downgrade to Free
      break;
    default:
      // Unknown event — acknowledge
      break;
  }

  return NextResponse.json({ ok: true });
}
