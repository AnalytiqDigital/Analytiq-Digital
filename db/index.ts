import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prevent the app from crashing if the URL is missing
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from environment variables');
}

// Connect to your Postgres database
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });