import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // TEMP-DIAG: matcher disabled to verify whether next-intl middleware
  // rewrite is what disables on-demand ISR caching. Restore before merge.
  matcher: [],
};
