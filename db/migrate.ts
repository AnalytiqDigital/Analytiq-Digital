import { config } from 'dotenv';
config({ path: '.env.local' });
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import postgres from 'postgres';

// Explicit, ordered list of Postgres migration files. The SQLite-era
// 0000_silly_matthew_murdock.sql / 0001_true_cerise.sql are deliberately
// excluded (wrong dialect; 0001 even DROPs tables).
const MIGRATIONS = [
  '0000_core_pg.sql',
  '0002_whatsapp_agent.sql',
  '0003_portal.sql',
  '0004_blog_rich_content.sql',
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is missing — set it in .env.local');
  }
  // Same SSL rule as db/index.ts: hosted providers require SSL, localhost skips it.
  const isLocalhost = /^(postgres(ql)?:\/\/)?(localhost|127\.0\.0\.1)/i.test(url);
  const sql = postgres(url, {
    max: 1,
    ssl: isLocalhost ? undefined : 'require',
  });

  const dir = path.join(process.cwd(), 'db', 'migrations');
  for (const file of MIGRATIONS) {
    const full = path.join(dir, file);
    if (!existsSync(full)) {
      console.log(`skip (missing): ${file}`);
      continue;
    }
    console.log(`applying ${file}...`);
    const text = readFileSync(full, 'utf8');
    await sql.unsafe(text);
    console.log(`  done: ${file}`);
  }
  await sql.end();
  console.log('Migrate complete.');
}

main().catch((err) => {
  console.error('Migrate failed:', err);
  process.exit(1);
});
