import type { WebhookEvent } from "@waffo/pancake-ts";
import { getPrisma, isDbConfigured } from "./prisma";

// Subscription persistence (P1-0)
// Maps Waffo Pancake webhook events to the local Subscription row keyed by the
// buyer's email (set from the NextAuth session). All functions degrade
// gracefully when DATABASE_URL is absent — they no-op / return null so the app
// still builds and runs without a database.

export interface SubscriptionView {
  plan: string;
  status: string;
  /** ISO string of the current billing period end, or null. */
  currentPeriodEnd: string | null;
  /** Waffo order id backing this subscription, or null if unknown (legacy rows). */
  waffoOrderId: string | null;
}

/**
 * Map a Waffo event type to our Subscription.status.
 * Returns null for events we intentionally ignore (e.g. refund.failed).
 */
function statusForEventType(eventType: string): string | null {
  switch (eventType) {
    case "order.completed":
    case "subscription.activated":
    case "subscription.payment_succeeded":
    case "subscription.uncanceled":
    case "subscription.updated":
      return "active";
    case "subscription.canceling":
      return "canceling";
    case "subscription.canceled":
    case "refund.succeeded":
      return "canceled";
    case "subscription.past_due":
      return "past_due";
    default:
      return null;
  }
}

function toDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Persist a Waffo webhook event to the Subscription table.
 * Idempotent: if we already recorded the same business eventId, it's skipped.
 * Safe to call without a configured DB (no-ops with a warning).
 */
export async function persistWebhookEvent(
  event: WebhookEvent
): Promise<void> {
  if (!isDbConfigured) {
    console.warn(
      "[subscriptions] DATABASE_URL not set — skipping webhook persistence"
    );
    return;
  }

  const status = statusForEventType(event.eventType);
  if (!status) return; // nothing actionable

  const email = event.data?.buyerEmail;
  if (!email) {
    console.warn("[subscriptions] webhook missing buyerEmail — skipping");
    return;
  }

  const prisma = getPrisma();

  // Idempotency: skip if this business event was already processed.
  const already = await prisma.subscription.findFirst({
    where: { waffoEventId: event.eventId },
    select: { id: true },
  });
  if (already) return;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const currentPeriodStart = toDate(event.data?.currentPeriodStart);
  const currentPeriodEnd = toDate(event.data?.currentPeriodEnd);
  const canceledAt = toDate(event.data?.canceledAt);

  // For canceling/canceled, the effective access end is the period end
  // (canceledAt is the initiation timestamp). Fall back to canceledAt.
  const cancelAt =
    status === "canceling" || status === "canceled"
      ? (currentPeriodEnd ?? canceledAt)
      : null;

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: "pro",
      status,
      waffoOrderId: event.data?.orderId ?? null,
      waffoEventId: event.eventId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAt,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      plan: "pro",
      status,
      waffoOrderId: event.data?.orderId ?? null,
      waffoEventId: event.eventId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAt,
    },
  });
}

/**
 * Read the subscription for an email, or null if none / DB unconfigured.
 */
export async function getSubscriptionByEmail(
  email: string
): Promise<SubscriptionView | null> {
  if (!isDbConfigured || !email) return null;

  const user = await getPrisma().user.findUnique({
    where: { email },
    select: {
      subscription: {
        select: {
          plan: true,
          status: true,
          currentPeriodEnd: true,
          waffoOrderId: true,
        },
      },
    },
  });

  const sub = user?.subscription;
  if (!sub) return null;

  return {
    plan: sub.plan,
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd
      ? sub.currentPeriodEnd.toISOString()
      : null,
    waffoOrderId: sub.waffoOrderId,
  };
}

/**
 * Whether a subscription status can still be cancelled from the account UI.
 * "active" is the normal case; "canceling" is allowed so a retry after a
 * webhook race re-confirms the request instead of failing.
 */
export function canCancelStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "canceling";
}

/**
 * Whether the user currently enjoys Pro benefits.
 * "active" always counts; "canceling" counts until the period end.
 */
export function isProActive(sub: SubscriptionView | null): boolean {
  if (!sub) return false;
  if (sub.status === "active") return true;
  if (sub.status === "canceling" && sub.currentPeriodEnd) {
    return new Date(sub.currentPeriodEnd).getTime() > Date.now();
  }
  return false;
}

/**
 * Backfill the Waffo order id on a subscription row. Used after a legacy
 * GraphQL lookup finds the order for rows created before the id was stored.
 * No-op when DB is unconfigured or the row already has an id.
 */
export async function updateSubscriptionOrderId(
  email: string,
  orderId: string
): Promise<void> {
  if (!isDbConfigured || !email || !orderId) return;

  const user = await getPrisma().user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return;

  await getPrisma().subscription.updateMany({
    where: { userId: user.id, waffoOrderId: null },
    data: { waffoOrderId: orderId },
  });
}
