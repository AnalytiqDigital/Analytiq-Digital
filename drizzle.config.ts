// import { defineConfig } from 'drizzle-kit';
// import { config } from 'dotenv';

// // 1. Force Drizzle to read your specific environment file
// config({ path: '.env.local' }); 

// export default defineConfig({
//   schema: './db/schema.ts', // Ensure this matches your actual schema path
//   out: './db/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     // 2. Use the DIRECT_URL (port 5432) we set up earlier
//     url: process.env.DIRECT_URL!, 
//   },
// });




import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load .env.local so `db:push` works without a manual export.
config({ path: '.env.local' });

// Schema pushes need a DIRECT (5432) connection — the pooled (6543) URL
// can't run introspection queries. Runtime keeps using DATABASE_URL.
const pushUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!pushUrl) {
  throw new Error('Set DATABASE_URL (and DIRECT_URL for schema pushes) in .env.local');
}

export default defineConfig({
  schema: ['./db/schema.ts', './db/schema-whatsapp.ts', './db/schema-portal.ts'],
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: pushUrl,
  },
});