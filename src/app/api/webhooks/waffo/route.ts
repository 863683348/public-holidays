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
    // Verify against the PRODUCTION webhook public key. We pin environment to
    // "prod" so prod-signed events always validate, and prefer the explicit
    // WAFFO_WEBHOOK_PROD_PUBLIC_KEY env var (set in Vercel) when present —
    // falling back to the SDK's built-in prod key only if it's unset.
    const webhookPublicKey = process.env.WAFFO_WEBHOOK_PROD_PUBLIC_KEY;
    event = getWaffo().webhooks.verify(rawBody, signature, {
      environment: "prod",
      ...(webhookPublicKey ? { publicKey: webhookPublicKey } : {}),
    });
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
