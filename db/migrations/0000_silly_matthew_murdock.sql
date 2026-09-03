CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`featured_image` text,
	`category` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`author_name` text DEFAULT '' NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`seo_keywords` text,
	`canonical_url` text,
	`og_image` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `case_studies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`client` text DEFAULT '' NOT NULL,
	`industry` text DEFAULT '' NOT NULL,
	`service_slug` text,
	`summary` text DEFAULT '' NOT NULL,
	`challenge` text DEFAULT '' NOT NULL,
	`approach` text DEFAULT '' NOT NULL,
	`solution` text DEFAULT '' NOT NULL,
	`results` text DEFAULT '[]' NOT NULL,
	`tech` text DEFAULT '[]' NOT NULL,
	`image` text,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_studies_slug_unique` ON `case_studies` (`slug`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_url` text NOT NULL,
	`website_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company` text,
	`service_interest` text,
	`budget_range` text,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`notes` text DEFAULT '',
	`assigned_to` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`alt_text` text DEFAULT '',
	`title` text DEFAULT '',
	`description` text DEFAULT '',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`technologies` text DEFAULT '[]' NOT NULL,
	`image` text,
	`project_url` text,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolio_items_slug_unique` ON `portfolio_items` (`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text DEFAULT 'google' NOT NULL,
	`external_id` text,
	`author_name` text NOT NULL,
	`author_photo` text,
	`rating` integer NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`review_time` integer,
	`synced_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_external_id_unique` ON `reviews` (`external_id`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT 'compass' NOT NULL,
	`short_description` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`benefits` text DEFAULT '[]' NOT NULL,
	`image` text,
	`from_price` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text DEFAULT 'AnalytIQ Digital' NOT NULL,
	`tagline` text DEFAULT 'Where Data Meets Intelligence' NOT NULL,
	`logo_url` text DEFAULT '/logo.png' NOT NULL,
	`phone` text DEFAULT '',
	`email` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`social_links` text DEFAULT '{}' NOT NULL,
	`google_place_id` text DEFAULT '',
	`seo_default_title` text DEFAULT '',
	`seo_default_description` text DEFAULT '',
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`content` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`photo_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);