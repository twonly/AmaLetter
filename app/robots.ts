import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amaletter.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/styles', '/write'],
        disallow: [
          '/api/',
          '/care',
          '/letters',
          '/letter/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
