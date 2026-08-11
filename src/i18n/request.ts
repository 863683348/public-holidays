import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// English messages as the ultimate fallback source for any missing key.
// This prevents a single missing translation from throwing a 500 (which wastes
// crawl budget and can trigger soft-404s) — instead we render the English value.
import enMessages from "./messages/en.json";

type Messages = Record<string, unknown>;

function lookup(messages: Messages, namespace: string | undefined, key: string): string | undefined {
  let node: unknown = messages;
  if (namespace) {
    node = (node as Messages)[namespace];
  }
  if (node && typeof node === "object") {
    const val = (node as Messages)[key];
    return typeof val === "string" ? val : undefined;
  }
  return undefined;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    // Swallow missing-message errors (log only) so a missing key degrades to a
    // fallback string instead of a hard 500 that hurts crawl budget / indexing.
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        console.warn(`[i18n] missing message: ${error.message}`);
      } else {
        console.error(error);
      }
    },
    // Fall back to the English value for the same key; if even that is missing,
    // fall back to the key path itself so the UI still renders something.
    getMessageFallback({ namespace, key }) {
      const enValue = lookup(enMessages as Messages, namespace, key);
      if (enValue !== undefined) return enValue;
      return namespace ? `${namespace}.${key}` : key;
    },
  };
});
