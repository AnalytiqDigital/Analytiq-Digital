import { describe, it, expect } from 'vitest';
import { eq, getTableColumns } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pg-proxy';
import { blogPosts } from '@/db/schema';
import { buildRecordValues, InvalidFieldError } from '@/lib/admin-resources';
import { toDateFieldValue } from '@/lib/date-field';

const columns = getTableColumns(blogPosts) as any;
// A driverless Drizzle instance: .toSQL() runs the same value serialization
// that used to throw "e.toISOString is not a function", without a database.
const db = drizzle(async () => ({ rows: [] }));
const qb = {
  insert: (values: Record<string, unknown>) => db.insert(blogPosts).values(values as any).toSQL(),
  update: (values: Record<string, unknown>) => db.update(blogPosts).set(values as any).where(eq(blogPosts.id, 1)).toSQL(),
};

const newPost = {
  title: 'Hello',
  slug: 'hello',
  excerpt: 'Short',
  content: 'Body',
  status: 'published',
  tags: ['a'],
  publishedAt: '2026-09-28',
};

describe('blog post publication dates', () => {
  it('new post: converts a date-picker string into a Date that Drizzle can serialize', () => {
    const values = buildRecordValues(columns, newPost);
    expect(values.publishedAt).toBeInstanceOf(Date);
    expect((values.publishedAt as Date).toISOString()).toBe('2026-09-28T00:00:00.000Z');
    const q = qb.insert(values);
    expect(q.params).toContain('2026-09-28T00:00:00.000Z');
  });

  it('edited post: accepts the ISO string returned by the API and a changed date', () => {
    const stored = buildRecordValues(columns, { title: 'Hello 2', publishedAt: '2026-09-28T00:00:00.000Z' });
    expect((stored.publishedAt as Date).toISOString()).toBe('2026-09-28T00:00:00.000Z');
    const changed = buildRecordValues(columns, { publishedAt: '2026-10-01' });
    expect((changed.publishedAt as Date).toISOString()).toBe('2026-10-01T00:00:00.000Z');
    expect(() => qb.update({ ...changed, updatedAt: new Date() })).not.toThrow();
    // Fields absent from an edit payload are left untouched.
    expect('title' in changed).toBe(false);
  });

  it('edit form pre-fills the date picker from stored values', () => {
    expect(toDateFieldValue('2026-09-28T00:00:00.000Z')).toBe('2026-09-28');
    expect(toDateFieldValue(new Date('2026-09-28T00:00:00.000Z'))).toBe('2026-09-28');
    expect(toDateFieldValue(null)).toBe('');
    expect(toDateFieldValue('garbage')).toBe('');
  });

  it('empty publication date is saved as null', () => {
    for (const empty of ['', '   ', null]) {
      const values = buildRecordValues(columns, { ...newPost, publishedAt: empty });
      expect(values.publishedAt).toBeNull();
      expect(() => qb.insert(values)).not.toThrow();
    }
  });

  it('invalid date values are rejected with a clear error instead of crashing', () => {
    for (const bad of ['not a date', '2026-02-31', '2026-13-01', '28/09/2026', {}, true]) {
      expect(() => buildRecordValues(columns, { ...newPost, publishedAt: bad })).toThrow(InvalidFieldError);
    }
    try {
      buildRecordValues(columns, { ...newPost, publishedAt: 'nope' });
    } catch (err) {
      expect((err as InvalidFieldError).field).toBe('publishedAt');
      expect((err as Error).message).toMatch(/valid date/);
    }
  });

  it('never lets the client set protected columns', () => {
    const values = buildRecordValues(columns, { ...newPost, id: 99, createdAt: 'x', updatedAt: 'y' });
    expect(values).not.toHaveProperty('id');
    expect(values).not.toHaveProperty('createdAt');
    expect(values).not.toHaveProperty('updatedAt');
  });
});
