import { WaffoPancake } from "@waffo/pancake-ts";

// Waffo Pancake — Merchant of Record payment client
// Docs: https://docs.waffo.ai
// Env vars: Dashboard → Settings → Developers
const merchantId = process.env.WAFFO_MERCHANT_ID ?? "";
const privateKey = process.env.WAFFO_PRIVATE_KEY ?? "";

export const WAFFO_PRODUCT_ID =
  process.env.WAFFO_PRODUCT_ID ?? ""; // e.g. "PROD_xxx"
export const WAFFO_STORE_ID =
  process.env.WAFFO_STORE_ID ?? ""; // e.g. "STO_xxx"

export const isWaffoConfigured = Boolean(
  merchantId && privateKey && WAFFO_PRODUCT_ID && WAFFO_STORE_ID
);

// Lazy singleton — SDK validates merchantId at construction, so only
// instantiate once config exists. Importing this module must never throw
// when env vars are absent (e.g., during build page-data collection).
let _client: WaffoPancake | null = null;

export function getWaffo(): WaffoPancake {
  if (!isWaffoConfigured) {
    throw new Error("Waffo Pancake is not configured (missing env vars)");
  }
  if (!_client) {
    _client = new WaffoPancake({ merchantId, privateKey });
  }
  return _client;
}
