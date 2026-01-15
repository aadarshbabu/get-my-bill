import type { LocalePrefix } from "node_modules/next-intl/dist/types/src/routing/types";

import { BILLING_INTERVAL, type PricingPlan } from "@/types/Subscription";

const localePrefix: LocalePrefix = "as-needed";

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: "GetMyBill",
  locales: [
    {
      id: "en",
      name: "English",
    },
    { id: "fr", name: "Français" },
  ],
  defaultLocale: "en",
  localePrefix,
};

export const AllLocales = AppConfig.locales.map((locale) => locale.id);

export const PLAN_ID = {
  FREE: "free",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.FREE]: {
    id: PLAN_ID.FREE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: "",
    devPriceId: "",
    prodPriceId: "",
    features: {
      invoices: 10,
      templates: "basic",
      reports: "basic",
    },
  },
  [PLAN_ID.PREMIUM]: {
    id: PLAN_ID.PREMIUM,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: "price_premium_test", // Use for testing
    // FIXME: Update the price ID, you can create it after running `npm run stripe:setup-price`
    devPriceId: "price_1PNksvKOp3DEwzQlGOXO7YBK",
    prodPriceId: "",
    features: {
      unlimited: true,
      analytics: "Advanced",
      gstAccounts: "Multi",
      report: "Advanced",
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: "price_enterprise_test", // Use for testing
    // FIXME: Update the price ID, you can create it after running `npm run stripe:setup-price`
    devPriceId: "price_1PNksvKOp3DEwzQli9IvXzgb",
    prodPriceId: "price_123",
    features: {
      everythingInProfessional: true,
      templates: "Customizable",
      accountManager: "Dedicated",
      onPremises: true,
      prioritySupport: true,
    },
  },
};
