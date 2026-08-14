# public-holidays - Cloudflare caching setup runbook

Goal: make sure the Vercel FOT (Fast Origin Transfer) traffic waste is genuinely
saved on Cloudflare via **KV incremental cache + edge Cache Rule**, instead of
being swapped for Worker CPU waste.

Code-side changes are already committed:
- `open-next.config.ts` - enables the KV incremental cache backend
- `wrangler.jsonc` - KV namespace binding placeholder (`NEXT_INC_CACHE_KV`)
- `cache-rule.json` - the P1 Cloudflare Cache Rule payload

The steps below require your Cloudflare account permissions (the sandbox has no
CF token, so they cannot be run for you).

---

## 1. Create the KV namespace (P0, required)

```bash
# run in the public-holidays project root
npx wrangler kv namespace create NEXT_INC_CACHE_KV
```

It returns JSON like:

```json
{ "binding": "NEXT_INC_CACHE_KV", "id": "abcdef1234567890abcdef1234567890" }
```

Copy that `id` into `wrangler.jsonc`, replacing the placeholder:

```jsonc
"kv_namespaces": [
  { "binding": "NEXT_INC_CACHE_KV", "id": "abcdef1234567890abcdef1234567890" }
]
```

> The id must be a real 32-char hex string, otherwise `wrangler deploy` fails
> validation.

---

## 2. Deploy (so the KV binding + new config take effect)

```bash
npm run deploy
# equivalent to: opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

After deploy, OpenNext ISR pages (holiday detail pages, etc.) are written to
`NEXT_INC_CACHE_KV`, and `/api/revalidate`'s `revalidatePath` also lands in KV -
shared across Worker instances, no origin regeneration after cold start.

---

## 3. Create the edge Cache Rule (P1, required)

Cloudflare by default does NOT cache HTML (only static assets), so the
`s-maxage=604800` headers in `next.config.ts` are ignored for HTML. This rule
makes HTML edge-cacheable while honoring the origin cache headers.

### Option A: API (uses the bundled `cache-rule.json`)

```bash
export CF_API_TOKEN="<token with Cache Rules edit permission>"
export CF_ZONE_ID="<zone id of public-holidays.shop>"

curl -s -X POST \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/cache/rules" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cache-rule.json
```

`success: true` in the response means it was created. The rule expression:

```
(http.request.method eq "GET")
and not (
  starts_with(http.request.uri.path, "/api")
  or starts_with(http.request.uri.path, "/account")
  or starts_with(http.request.uri.path, "/checkout")
  or starts_with(http.request.uri.path, "/signin")
  or starts_with(http.request.uri.path, "/auth")
)
```

Action: `Cache Eligible = Yes`, `Edge TTL = Respect origin` (honors the origin
`s-maxage=604800`), `Browser TTL = Respect origin`.

### Option B: Dashboard

1. Log into Cloudflare, select the `public-holidays.shop` zone.
2. Left menu **Rules -> Cache Rules -> Create rule**.
3. Name: `PH cache public HTML`.
4. Expression: paste the expression above.
5. Action: **Set cache settings** -> enable **Cache Eligible**, set
   **Edge TTL = Respect origin** and **Browser TTL = Respect origin**.
6. Deploy / Save.

> Excluded: `/api` (incl. `/api/revalidate`), `/account`, `/checkout`,
> `/signin`, `/auth` are never cached, so pages with cookies / personalization /
> payments are never served from cache. All other public GET pages (home,
> holiday detail pages) enter the edge cache and honor `s-maxage=604800` (7 days)
> + SWR.

---

## 4. Verify

```bash
# 1) KV working: ISR page should go MISS then HIT
curl -sI https://public-holidays.shop/en/us/2026 | grep -i "cf-cache-status"
# expect cf-cache-status: HIT on the second request

# 2) after revalidate, origin should regenerate then re-cache
curl -s "https://public-holidays.shop/api/revalidate?secret=$REVALIDATE_SECRET&path=/en/us/2026"
```

In the dashboard **Caching -> Cache Analytics**, watch `Cache Hit Ratio` go up and
Worker request count go down.

---

## Cleanup suggestions

- `vercel.json` is now useless (site migrated to Cloudflare); delete it to avoid
  confusion. Also confirm the Vercel `public-holidays` project is paused/deleted
  so it stops billing FOT.
- DNS: confirm apex `public-holidays.shop` + `www` point to Cloudflare, with no
  leftover A/CNAME pointing at Vercel.
