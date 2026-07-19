/// <reference types="@cloudflare/workers-types" />

// Augment the (otherwise empty) Env interface provided by
// @cloudflare/workers-types with our runtime bindings. This makes
// `import { env } from "cloudflare:workers"` strongly typed.
interface Env {
  HOLIDAY_CACHE: KVNamespace;
}
