import { setRequestLocale } from 'next-intl/server';
import About from '@/content/about.mdx';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className=" px-3 py-10">
      <About />
    </div>
  );
}

