-- Core CMS tables (Postgres baseline). Matches db/schema.ts.
-- Idempotent (IF NOT EXISTS): safe to re-run.
-- Apply with: npm run db:migrate
-- (drizzle-kit push needs a direct 5432 connection and stalls on the
-- Supabase pooler; this file applies cleanly through the pooled URL.)
-- NOTE: 0000_silly_matthew_murdock.sql / 0001_true_cerise.sql are leftover
-- SQLite-era files — do NOT apply them to Postgres (0001 even DROPs tables).

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "role" text DEFAULT 'admin' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "services" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "icon" text DEFAULT 'compass' NOT NULL,
  "short_description" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "image" text,
  "from_price" text DEFAULT '' NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "services_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "portfolio_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "image" text,
  "project_url" text,
  "featured" boolean DEFAULT false NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portfolio_items_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "case_studies" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "client" text DEFAULT '' NOT NULL,
  "industry" text DEFAULT '' NOT NULL,
  "service_slug" text,
  "summary" text DEFAULT '' NOT NULL,
  "challenge" text DEFAULT '' NOT NULL,
  "approach" text DEFAULT '' NOT NULL,
  "solution" text DEFAULT '' NOT NULL,
  "results" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "tech" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "image" text,
  "published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "case_studies_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "clients" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "logo_url" text NOT NULL,
  "website_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "company" text DEFAULT '' NOT NULL,
  "role" text DEFAULT '' NOT NULL,
  "content" text NOT NULL,
  "rating" integer DEFAULT 5 NOT NULL,
  "photo_url" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "source" text DEFAULT 'google' NOT NULL,
  "external_id" text,
  "author_name" text NOT NULL,
  "author_photo" text,
  "rating" integer NOT NULL,
  "text" text DEFAULT '' NOT NULL,
  "review_time" timestamp,
  "synced_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "reviews_external_id_unique" UNIQUE("external_id")
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text DEFAULT '' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "content_json" jsonb,
  "content_html" text,
  "featured_image" text,
  "category" text DEFAULT '' NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" text DEFAULT 'draft' NOT NULL,
  "published_at" timestamp,
  "author_name" text DEFAULT '' NOT NULL,
  "seo_title" text,
  "seo_description" text,
  "seo_keywords" text,
  "canonical_url" text,
  "og_image" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "leads" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "company" text,
  "service_interest" text,
  "budget_range" text,
  "message" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'New' NOT NULL,
  "notes" text DEFAULT '' NOT NULL,
  "assigned_to" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "visitor_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "page" text NOT NULL,
  "referrer" text,
  "source" text DEFAULT 'direct' NOT NULL,
  "campaign" text,
  "user_agent" text,
  "ip_address" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY NOT NULL,
  "filename" text NOT NULL,
  "url" text NOT NULL,
  "alt_text" text DEFAULT '' NOT NULL,
  "title" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "company_name" text DEFAULT 'AnalytIQ Digital' NOT NULL,
  "tagline" text DEFAULT 'Where Data Meets Intelligence' NOT NULL,
  "logo_url" text DEFAULT '/logo.png' NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "email" text DEFAULT '' NOT NULL,
  "address" text DEFAULT '' NOT NULL,
  "social_links" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "google_place_id" text DEFAULT '' NOT NULL,
  "seo_default_title" text DEFAULT '' NOT NULL,
  "seo_default_description" text DEFAULT '' NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
