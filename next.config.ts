import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // `cloudflare:workers` is provided by the Workers runtime (via OpenNext) at
    // runtime. Mark it external so webpack does not try to bundle the scheme.
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ "cloudflare:workers": "cloudflare:workers" });
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
