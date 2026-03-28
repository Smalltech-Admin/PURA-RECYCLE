import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = 'https://pura-recycle.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const mainPages = [
    { url: `${SITE_URL}`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${SITE_URL}/nonmetal`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${SITE_URL}/machine`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/motercar`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/businessinfo`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/company`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/access`, priority: 0.6, changeFrequency: 'yearly' as const },
    { url: `${SITE_URL}/contact`, priority: 0.8, changeFrequency: 'yearly' as const },
  ];

  const nonmetalSubPages = [
    'dou', 'densen', 'battery', 'shinchuu', 'moter',
    'radieter', 'namari', 'hoile', 'tokushu', 'other',
  ].map((slug) => ({
    url: `${SITE_URL}/nonmetal/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  return [...mainPages, ...nonmetalSubPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
