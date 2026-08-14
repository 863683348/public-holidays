import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// P0 - Enable Cloudflare KV as the ISR incremental cache backend.
// Binding name MUST be NEXT_INC_CACHE_KV (matches wrangler.jsonc).
//
// Why this is required: defineCloudflareConfig() defaults incrementalCache to
// "dummy" (in-memory only, not shared across Worker instances, lost on deploy /
// cold start). That makes /api/revalidate's revalidatePath a no-op and forces a
// full origin regeneration on every request - i.e. you only swap Vercel FOT
// traffic waste for Worker CPU waste.
//
// With KV injected:
//   - revalidatePath writes/invalidates KV, shared by all Worker instances
//   - pages keep hitting KV after deploy, no origin regeneration
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
