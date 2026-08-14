import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// KV incremental cache DISABLED since 2026-08-14.
//
// Why: Cloudflare Free KV allows only 1,000 writes/day (resets 00:00 UTC =
// 08:00 Beijing). This site has 20K+ URLs; every ISR cache MISS writes a KV
// entry, so crawlers blow the daily quota in minutes and block deploys with
// error 10048 (exceeded KV daily write limit).
//
// Fix: use the default "dummy" (in-memory) incremental cache -> ZERO KV writes.
// The edge Cache Rule (cache-rule.json: s-maxage=604800 + SWR) sits IN FRONT of
// the Worker and caches HTML at Cloudflare's edge for 7 days, so the Worker only
// regenerates on edge-cache MISS (~once per URL per 7 days). Net result:
//   - no KV usage at all (deploy no longer blocked by the write quota)
//   - minimal Worker CPU (edge serves the other 99% of requests)
//
// Tradeoff: /api/revalidate's revalidatePath becomes a no-op (dummy cache isn't
// shared), but the edge Cache Rule already auto-refreshes via SWR, and you can
// purge on demand via the Cloudflare cache-purge API if needed.
//
// To re-enable cross-instance revalidatePath later, move to the $5 Paid Workers
// plan (1M writes/month) and switch back to kvIncrementalCache.
export default defineCloudflareConfig({});
