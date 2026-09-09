import { pgTable, text, integer, serial, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('compass'),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull().default(''),
  benefits: jsonb('benefits').$type<string[]>().notNull().default([]),
  image: text('image'),
  fromPrice: text('from_price').notNull().default(''),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const portfolioItems = pgTable('portfolio_items', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull().default(''),
  technologies: jsonb('technologies').$type<string[]>().notNull().default([]),
  image: text('image'),
  projectUrl: text('project_url'),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

export const caseStudies = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  client: text('client').notNull().default(''),
  industry: text('industry').notNull().default(''),
  serviceSlug: text('service_slug'),
  summary: text('summary').notNull().default(''),
  challenge: text('challenge').notNull().default(''),
  approach: text('approach').notNull().default(''),
  solution: text('solution').notNull().default(''),
  results: jsonb('results').$type<string[]>().notNull().default([]),
  tech: jsonb('tech').$type<string[]>().notNull().default([]),
  image: text('image'),
  published: boolean('published').notNull().default(true),
  ...timestamps,
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  websiteUrl: text('website_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  ...timestamps,
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company').notNull().default(''),
  role: text('role').notNull().default(''),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  photoUrl: text('photo_url'),
  status: text('status').notNull().default('pending'),
  ...timestamps,
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  source: text('source').notNull().default('google'),
  externalId: text('external_id').unique(),
  authorName: text('author_name').notNull(),
  authorPhoto: text('author_photo'),
  rating: integer('rating').notNull(),
  text: text('text').notNull().default(''),
  reviewTime: timestamp('review_time'),
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull().default(''),
  featuredImage: text('featured_image'),
  category: text('category').notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  authorName: text('author_name').notNull().default(''),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  canonicalUrl: text('canonical_url'),
  ogImage: text('og_image'),
  ...timestamps,
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  serviceInterest: text('service_interest'),
  budgetRange: text('budget_range'),
  message: text('message').notNull().default(''),
  status: text('status').notNull().default('New'),
  notes: text('notes').default(''),
  assignedTo: text('assigned_to'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// export const visitorEvents = pgTable('visitor_events', {
//   id: serial('id').primaryKey(),
//   page: text('page').notNull(),
//   referrer: text('referrer'),
//   source: text('source').notNull().default('direct'),
//   campaign: text('campaign'),
//   userAgent: text('user_agent'),
//   ipAddress: text('ip_address'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),










  
// });

export const visitorEvents = pgTable('visitor_events', {
  id: serial('id').primaryKey(),
  page: text('page').notNull(),
  referrer: text('referrer'),
  source: text('source').notNull().default('direct'),
  campaign: text('campaign'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});


export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  altText: text('alt_text').default(''),
  title: text('title').default(''),
  description: text('description').default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  companyName: text('company_name').notNull().default('AnalytIQ Digital'),
  tagline: text('tagline').notNull().default('Where Data Meets Intelligence'),
  logoUrl: text('logo_url').notNull().default('/logo.png'),
  phone: text('phone').default(''),
  email: text('email').notNull().default(''),
  address: text('address').notNull().default(''),
  socialLinks: jsonb('social_links')
    .$type<{ linkedin?: string; x?: string; instagram?: string; facebook?: string }>()
    .notNull()
    .default({}),
  googlePlaceId: text('google_place_id').default(''),
  seoDefaultTitle: text('seo_default_title').default(''),
  seoDefaultDescription: text('seo_default_description').default(''),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});