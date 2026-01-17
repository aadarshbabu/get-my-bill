import { getTranslations, setRequestLocale } from "next-intl/server";

import { CTA } from "@/templates/CTA";
// import { DemoBanner } from "@/templates/DemoBanner";
import { FAQ } from "@/templates/FAQ";
import { Features } from "@/templates/Features";
import { Hero } from "@/templates/Hero";
import { Pricing } from "@/templates/Pricing";
import { Sponsors } from "@/templates/Sponsors";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Index",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
}

