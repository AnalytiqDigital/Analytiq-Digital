import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as waSchema from './schema-whatsapp';
import * as portalSchema from './schema-portal';

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing from environment variables');
  }

  // Hosted Postgres providers (Neon, Supabase, etc.) require SSL even in
  // local dev. Only skip it for an explicit localhost URL (e.g. Docker).
  const isLocalhost = /^(postgres(ql)?:\/\/)?(localhost|127\.0\.0\.1)/i.test(databaseUrl);
  const client = postgres(databaseUrl, {
    max: 10,
    ssl: isLocalhost ? undefined : 'require',
  });

  return drizzle(client, { schema: { ...schema, ...waSchema, ...portalSchema } });
}

type DbClient = ReturnType<typeof createDb>;

let cached: DbClient | null = null;

function getDb(): DbClient {
  if (!cached) cached = createDb();
  return cached;
}

// The client is created lazily so that merely importing this module never
// throws during `next build` (which evaluates every route module, even when
// DATABASE_URL is unset in the build environment). The missing-env error
// surfaces only when a query actually runs.
export const db = new Proxy({} as DbClient, {
  get(_target, prop) {
    // Guard against Promise detection: anything probing `db.then` (e.g. an
    // accidental `await db`) must get `undefined`, not a missing-env throw.
    if (prop === 'then') return undefined;
    const value = Reflect.get(getDb(), prop);
    // Bind methods so Drizzle internals that rely on `this` keep working
    // when called as `db.select()`, `db.insert()`, etc.
    return typeof value === 'function' ? value.bind(getDb()) : value;
  },
});

// Evaluated lazily: dotenv may load .env.local after this module is first
// imported (e.g. seed.ts), so reading the env here at import time goes stale.
export function getDbFilePath(): string {
  return process.env.DATABASE_URL ? '(DATABASE_URL is set — value hidden)' : '(DATABASE_URL is not set)';
}
