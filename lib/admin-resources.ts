import * as schema from '@/db/schema';

export const resourceTables = {
  services: schema.services,
  portfolio: schema.portfolioItems,
  'case-studies': schema.caseStudies,
  clients: schema.clients,
  testimonials: schema.testimonials,
  blog: schema.blogPosts,
  leads: schema.leads,
  visits: schema.visitorEvents,
  media: schema.media,
} as const;

export type ResourceName = keyof typeof resourceTables;

export function isValidResource(name: string): name is ResourceName {
  return Object.prototype.hasOwnProperty.call(resourceTables, name);
}

// Columns that are server-managed and should never be set directly from a
// client payload, even by an authenticated admin.
export const PROTECTED_COLUMNS = new Set(['id', 'createdAt', 'updatedAt']);
