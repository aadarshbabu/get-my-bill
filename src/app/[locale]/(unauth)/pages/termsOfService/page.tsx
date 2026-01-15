import React from "react";
import { unstable_setRequestLocale } from 'next-intl/server';
import TermsOfServices from "@/content/termsOfService.mdx";

interface AboutPageProps {
  params: {
    locale: string;
  };
}
export default function page({ params: { locale } }: AboutPageProps) {
  unstable_setRequestLocale(locale);

  return (
    <div className=" py-12 px-8">
      <TermsOfServices />
    </div>
  );
}
