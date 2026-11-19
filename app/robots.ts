import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search + assistant crawlers: explicitly welcomed so ChatGPT Search,
      // Perplexity, Claude, and Gemini can discover, understand, and cite our pages.
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      {
        userAgent: '*',
        allow: '/',
        // Private areas stay out of every index, AI or otherwise.
        disallow: ['/admin/', '/portal/', '/api/'],
        // Note: /privacy and /terms are intentionally left crawlable (not
        // disallowed) so Google can read their noindex meta tag rather than
        // being blocked from seeing it at all.
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
