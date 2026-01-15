// "use client";
import { unstable_setRequestLocale } from 'next-intl/server';
import PrivacyPolicy from "@/content/privacyPolicy.mdx";

interface AboutPageProps {
  params: {
    locale: string;
  };
}
export default function page({ params: { locale } }: AboutPageProps) {
  unstable_setRequestLocale(locale);

  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
