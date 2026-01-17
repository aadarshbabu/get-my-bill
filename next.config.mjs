import { fileURLToPath } from "node:url";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
// import createMDX from "@next/mdx";
import { createMDX } from "fumadocs-mdx/next";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/libs/Env");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["@electric-sql/pglite"],
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
};

const withMDXConfig = createMDX({
  // Add markdown plugins here, as desired
});

// Combine MDX configuration with other configurations
// IMPORTANT: next-intl must be the OUTERMOST wrapper to properly detect turbopack config
const finalConfig = withNextIntl(
  withMDXConfig(
    withSentryConfig(
      bundleAnalyzer(nextConfig),
      {
        // Sentry build options
        org: "nextjs-boilerplate-org",
        project: "nextjs-boilerplate",
        silent: !process.env.CI,
        widenClientFileUpload: true,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        telemetry: false,
      }
    )
  )
);

export default finalConfig;
