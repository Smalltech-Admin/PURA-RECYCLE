import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// 公開先のURL。CI では actions/configure-pages の base_url が渡る
// （github.io のサブパス公開でも、独自ドメインでも、実際の公開先になる）。
// 既定値は移管後の本番URL。app/layout.tsx と同じ扱いに揃えている。
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pura-recycle.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
