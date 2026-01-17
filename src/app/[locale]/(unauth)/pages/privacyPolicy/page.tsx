import { setRequestLocale } from 'next-intl/server';
import PrivacyPolicy from "@/content/privacyPolicy.mdx";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}

