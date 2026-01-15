import { fileURLToPath } from "node:url";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import createJiti from "jiti";
import withNextIntl from "next-intl/plugin";
// import createMDX from "@next/mdx";
import { createMDX } from "fumadocs-mdx/next";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/libs/Env");

const withNextIntlConfig = withNextIntl("./src/libs/i18n.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },
};

const withMDXConfig = createMDX({
  // Add markdown plugins here, as desired
});

// Combine MDX configuration with other configurations
const finalConfig = withMDXConfig(
  withSentryConfig(
    bundleAnalyzer(
      withNextIntlConfig({
        ...nextConfig, // Add Next.js config here
      })
    ),
    {
      // Sentry config
      org: "nextjs-boilerplate-org",
      project: "nextjs-boilerplate",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
      telemetry: false,
    }
  )
);

export default finalConfig;
