import { NextRequest, NextResponse } from "next/server";
import type { WebhookEvent } from "@waffo/pancake-ts";
import { getWaffo } from "@/lib/waffo";
import { persistWebhookEvent } from "@/lib/subscriptions";

// POST /api/webhooks/waffo
// Waffo Pancake webhook receiver — verify signature and persist subscription
// state. Always returns 200 so Waffo (Merchant of Record) does not retry
// indefinitely; persistence errors are logged, not surfaced as 5xx.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-waffo-signature") ?? "";

  let event: unknown;
  try {
    event = getWaffo().webhooks.verify(rawBody, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    await persistWebhookEvent(event as WebhookEvent);
  } catch (err) {
    // Never break webhook acknowledgement on DB issues — MoR will retry.
    console.error("[waffo-webhook] persistence failed", err);
  }

  return NextResponse.json({ ok: true });
}
