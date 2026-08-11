import { siteConfig } from "../lib/site";

export const createMetadata = ({
  title,
  description,
  keywords,
  path = "",
  image = "",
  noIndex = false,
} = {}) => {
  const canonical = `${siteConfig.url}${path}`;

  const finalTitle = title || siteConfig.defaultTitle;
  const finalDescription =
    description || siteConfig.defaultDescription;

  return {
    title: finalTitle,
    description: finalDescription,

    ...(keywords && {
      keywords,
    }),

    alternates: {
      canonical,
    },

    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: siteConfig.name,
      ...(image && {
        images: [{ url: image }],
      }),
    },

    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};