// 'use client';
import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import About from '@/content/about.mdx';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

export default function page({ params: { locale } }: AboutPageProps) {
  unstable_setRequestLocale(locale);
  return (
    <div className=" px-3 py-10">
      <About />
    </div>
  );
}
