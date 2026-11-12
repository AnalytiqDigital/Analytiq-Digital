import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { services, portfolioItems, caseStudies, blogPosts, clients, testimonials } from '@/db/schema';

export async function getPublishedServices() {
  return db.query.services.findMany({
    where: eq(services.published, true),
    orderBy: asc(services.sortOrder),
  });
}

export async function getServiceBySlug(slug: string) {
  return db.query.services.findFirst({
    where: and(eq(services.slug, slug), eq(services.published, true)),
  });
}

export async function getPublishedPortfolio() {
  return db.query.portfolioItems.findMany({
    where: eq(portfolioItems.published, true),
    orderBy: asc(portfolioItems.sortOrder),
  });
}

export async function getPortfolioItemBySlug(slug: string) {
  return db.query.portfolioItems.findFirst({
    where: and(eq(portfolioItems.slug, slug), eq(portfolioItems.published, true)),
  });
}

export async function getPublishedCaseStudies() {
  return db.query.caseStudies.findMany({
    where: eq(caseStudies.published, true),
    orderBy: desc(caseStudies.createdAt),
  });
}

export async function getCaseStudyBySlug(slug: string) {
  return db.query.caseStudies.findFirst({
    where: and(eq(caseStudies.slug, slug), eq(caseStudies.published, true)),
  });
}

/**
 * Publicly visible posts: `published`, plus `scheduled` ones whose
 * publishedAt has passed (so scheduling actually releases them — the admin
 * "Publish now" button only ever sets `published`, never flips `scheduled`).
 */
export async function getPublishedBlogPosts() {
  const now = new Date();
  const rows = await db.query.blogPosts.findMany({
    where: inArray(blogPosts.status, ['published', 'scheduled']),
    orderBy: desc(blogPosts.publishedAt),
  });
  return rows.filter((p) => !p.publishedAt || p.publishedAt <= now);
}

export async function getBlogPostBySlug(slug: string) {
  const now = new Date();
  const post = await db.query.blogPosts.findFirst({
    where: and(eq(blogPosts.slug, slug), inArray(blogPosts.status, ['published', 'scheduled'])),
  });
  if (!post) return undefined;
  if (post.publishedAt && post.publishedAt > now) return undefined;
  return post;
}

export async function getActiveClients() {
  return db.query.clients.findMany({
    where: eq(clients.active, true),
    orderBy: asc(clients.sortOrder),
  });
}

export async function getApprovedTestimonials() {
  return db.query.testimonials.findMany({
    where: eq(testimonials.status, 'approved'),
  });
}

/**
 * Lightweight previews for the home page. The home page only renders card
 * fields, so these select just those columns (skipping the large text/body
 * columns) to keep the per-visit payload small.
 */
export async function getPortfolioPreview(limit = 3) {
  return db.query.portfolioItems.findMany({
    where: eq(portfolioItems.published, true),
    orderBy: asc(portfolioItems.sortOrder),
    limit,
    columns: {
      slug: true,
      title: true,
      category: true,
      description: true,
      technologies: true,
      image: true,
    },
  });
}

export async function getCaseStudiesPreview() {
  return db.query.caseStudies.findMany({
    where: eq(caseStudies.published, true),
    orderBy: desc(caseStudies.createdAt),
    columns: {
      slug: true,
      title: true,
      industry: true,
      summary: true,
    },
  });
}

export async function getClientsPreview() {
  return db.query.clients.findMany({
    where: eq(clients.active, true),
    orderBy: asc(clients.sortOrder),
    columns: {
      name: true,
      logoUrl: true,
    },
  });
}

export async function getTestimonialsPreview() {
  return db.query.testimonials.findMany({
    where: eq(testimonials.status, 'approved'),
    columns: {
      name: true,
      company: true,
      role: true,
      content: true,
    },
  });
}
