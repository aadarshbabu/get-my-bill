import { useTranslations } from "next-intl";

import { PricingCard } from "@/features/billing/PricingCard";
import { PricingFeature } from "@/features/billing/PricingFeature";
import { PricingPlanList } from "@/utils/AppConfig";

export const PricingInformation = (props: {
  buttonList: Record<string, React.ReactNode>;
}) => {
  const t = useTranslations("PricingPlan");

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
      {Object.values(PricingPlanList).map((plan) => (
        <PricingCard
          key={plan.id}
          planId={plan.id}
          price={
            typeof plan.price === "number"
              ? t("price_with_currency", { price: plan.price })
              : t(plan.price) // Handle "Contact for quote"
          }
          interval={plan.interval}
          button={props.buttonList[plan.id]}
        >
          {Object.entries(plan.features).map(([featureKey, value]) => {
            // Dynamically render features based on translation keys
            if (typeof value === "boolean" && value) {
              return (
                <PricingFeature key={featureKey}>
                  {t(`feature_${featureKey}`)}
                </PricingFeature>
              );
            }
            if (typeof value === "string" || typeof value === "number") {
              return (
                <PricingFeature key={featureKey}>
                  {t(`feature_${featureKey}`, { number: value, type: value })}
                </PricingFeature>
              );
            }
            return null; // Skip if no valid value
          })}
        </PricingCard>
      ))}
      {/* {Object.values(PricingPlanList).map((plan) => (
        
        // <PricingCard
        //   key={plan.id}
        //   planId={plan.id}
        //   price={plan.price}
        //   interval={plan.interval}
        //   button={props.buttonList[plan.id]}
        // >
        //   <PricingFeature>
        //     {t("feature_allowed_invoice", {
        //       number: plan.features.teamMember,
        //     })}
        //   </PricingFeature>

        //   <PricingFeature>
        //     {t("feature_report", {
        //       number: plan.features.website,
        //     })}
        //   </PricingFeature>

        //   <PricingFeature>
        //     {t("feature_report", {
        //       number: plan.features.storage,
        //     })}
        //   </PricingFeature>

        //   <PricingFeature>
        //     {t("feature_transfer", {
        //       number: plan.features.transfer,
        //     })}
        //   </PricingFeature>

        //   <PricingFeature>{t("feature_email_support")}</PricingFeature>
        // </PricingCard>
      ))} */}
    </div>
  );
};
