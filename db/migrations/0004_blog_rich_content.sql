-- Rich blog content: TipTap JSON source of truth + rendered HTML cache.
-- Apply with: npm run db:push  (or paste into your Postgres console)
-- Matches db/schema.ts (blogPosts.contentJson / contentHtml).
-- Existing rows keep NULL here and fall back to the legacy `content` text
-- until they are opened and re-saved in the new editor (auto-converts).

ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content_json" jsonb;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content_html" text;
