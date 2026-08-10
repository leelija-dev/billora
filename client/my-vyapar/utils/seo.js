import { siteConfig } from '../lib/site';

export const createMetadata = ({ 
  title,           // Page-specific title
  description,     // Page-specific description
  path = '',       // Page-specific path
  image = '',      // Optional: social image
  noIndex = false, // Optional: no-index
} = {}) => {
  const canonical = `${siteConfig.url}${path}`;
  
  // Use page-specific values or fallback to defaults
  const finalTitle = title || siteConfig.defaultTitle;
  const finalDescription = description || siteConfig.defaultDescription;
  
  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      ...(image && { images: [{ url: image }] }),
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};