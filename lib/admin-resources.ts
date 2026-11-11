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
export class InvalidFieldError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'InvalidFieldError';
  }
}

/** Accepts Date objects, ISO strings, YYYY-MM-DD strings and epoch numbers. */
export function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (ymd) {
      const [y, m, d] = [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])];
      const date = new Date(Date.UTC(y, m - 1, d));
      // Reject rollovers such as 2026-02-31.
      if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
      return date;
    }
    if (!/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) return null;
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function coerceColumnValue(column: any, value: unknown, fieldName = 'field'): unknown {
  if (value === undefined) return value;
  if (value === '' || value === null) return null;

  const dataType = column?.dataType;

  if (dataType === 'date') {
    if (typeof value === 'string' && value.trim() === '') return null;
    const parsed = parseDateValue(value);
    if (!parsed) throw new InvalidFieldError(fieldName, `"${fieldName}" must be a valid date`);
    return column?.mode === 'string' ? parsed.toISOString() : parsed;
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

/**
 * Build the insert/update values for a table from a client payload: only real,
 * non-protected columns are copied, and every value is coerced to the type the
 * column expects. Throws InvalidFieldError for values that cannot be saved.
 *
 * Empty form inputs arrive as '' (coerced to null above). Inserting an explicit
 * NULL into a NOT NULL column that has a DB default would violate the
 * constraint even though the default exists — the default only applies when
 * the column is omitted. So:
 * - nullable column + empty → NULL (clears the field);
 * - NOT NULL with a default + empty → the type's empty default ('' for text,
 *   omitted for numbers/json so the DB default like 0 or [] applies);
 * - NOT NULL without a default (required) + empty → 400 with a clear message
 *   instead of a 500 NOT NULL violation.
 */
export function buildRecordValues(columns: Record<string, any>, body: Record<string, unknown>): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const key of Object.keys(columns)) {
    if (PROTECTED_COLUMNS.has(key)) continue;
    if (!(key in body)) continue;
    const column = columns[key];
    const coerced = coerceColumnValue(column, body[key], key);
    if (coerced === undefined) continue;
    if (coerced === null && column?.notNull) {
      if (column?.hasDefault) {
        // Optional field left empty: store the empty default so inserts
        // succeed and edits clear the field instead of crashing.
        if (column?.dataType === 'string') {
          values[key] = '';
          continue;
        }
        // Numbers / JSON / booleans: omit so the DB default (0, [], …) applies.
        continue;
      }
      throw new InvalidFieldError(key, `"${key}" is required.`);
    }
    values[key] = coerced;
  }
  return values;
}
