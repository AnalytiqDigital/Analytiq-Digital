import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Note: /privacy and /terms are intentionally left crawlable (not
      // disallowed) so Google can read their noindex meta tag rather than
      // being blocked from seeing it at all.
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
