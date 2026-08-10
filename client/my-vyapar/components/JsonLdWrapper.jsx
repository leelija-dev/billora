'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { generateHomepageSchema } from '@/utils/homepage-schema';

export default function JsonLdWrapper() {
  const pathname = usePathname();
  
  // ✅ Only render on homepage
  if (pathname !== '/') return null;
  
  const homepageSchema = generateHomepageSchema();
  
  return (
    <Script
      id="homepage-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(homepageSchema)
      }}
    />
  );
}