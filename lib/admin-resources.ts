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

/**
 * Coerce a raw JSON value from an admin form into something the Drizzle column
 * can serialize. Date/timestamp columns receive plain strings from <input
 * type="date">, and Drizzle calls value.toISOString() on them, which throws
 * "e.toISOString is not a function". Empty strings become null.
 */
export function coerceColumnValue(column: any, value: unknown): unknown {
  if (value === undefined) return value;
  if (value === '' || value === null) return null;

  const dataType = column?.dataType;

  if (dataType === 'date') {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return column?.mode === 'string' ? parsed.toISOString() : parsed;
      }
    }
    return null;
  }

  if (dataType === 'boolean' && typeof value === 'string') {
    return value === 'true' || value === '1';
  }

  if (dataType === 'number' && typeof value === 'string') {
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  if (dataType === 'json' && typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}
