import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { CTA } from "@/templates/CTA";
// import { DemoBanner } from "@/templates/DemoBanner";
import { FAQ } from "@/templates/FAQ";
import { Features } from "@/templates/Features";
import { Hero } from "@/templates/Hero";
import { Pricing } from "@/templates/Pricing";
import { Sponsors } from "@/templates/Sponsors";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "Index",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      {/* <DemoBanner /> */}
      {/* <Navbar /> */}
      <Hero />
      <Sponsors />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      {/* <Footer /> */}
    </>
  );
};

export default IndexPage;
