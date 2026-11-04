import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { services } from '@/lib/services-data';
import { caseStudies } from '@/lib/case-studies-data';
import { blogPosts } from '@/lib/blog-data';
import { portfolioItems } from '@/lib/portfolio-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/solutions`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/ai-automation`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/website-development-abuja`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/whatsapp-ai-assistant-nigeria`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/data-analytics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/book-a-consultation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.datePublished),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...caseStudyRoutes, ...blogRoutes];
}
