import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://thefastbill.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      {
        userAgent: 'msnbot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/personal'],
      },
      {
        userAgent: 'Mediapartners-Google',
        disallow: [],
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}