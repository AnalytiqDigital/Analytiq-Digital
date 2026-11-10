-- Client portal tables (clients, projects, milestones, invoices, payments, renewals, updates).
-- Apply with: npm run db:push  (or paste into your Postgres console)
-- Matches db/schema-portal.ts. Amounts are MAJOR units (e.g. 450000 = ₦450,000).

CREATE TABLE IF NOT EXISTS "portal_clients" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "company" text,
  "password_hash" text NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portal_clients_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "portal_projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "client_id" integer NOT NULL,
  "title" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "service_slug" text,
  "status" text DEFAULT 'Discovery' NOT NULL,
  "progress" integer DEFAULT 0 NOT NULL,
  "start_date" timestamp,
  "due_date" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "portal_milestones" (
  "id" serial PRIMARY KEY NOT NULL,
  "project_id" integer NOT NULL,
  "title" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "due_date" timestamp,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "portal_invoices" (
  "id" serial PRIMARY KEY NOT NULL,
  "invoice_number" text NOT NULL,
  "client_id" integer NOT NULL,
  "project_id" integer,
  "milestone_id" integer,
  "title" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "currency" text DEFAULT 'NGN' NOT NULL,
  "amount" integer NOT NULL,
  "amount_paid" integer DEFAULT 0 NOT NULL,
  "status" text DEFAULT 'draft' NOT NULL,
  "due_date" timestamp,
  "paid_at" timestamp,
  "paystack_reference" text,
  "notes" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portal_invoices_invoice_number_unique" UNIQUE("invoice_number")
);

CREATE TABLE IF NOT EXISTS "portal_payments" (
  "id" serial PRIMARY KEY NOT NULL,
  "invoice_id" integer NOT NULL,
  "currency" text DEFAULT 'NGN' NOT NULL,
  "amount" integer NOT NULL,
  "paystack_reference" text,
  "channel" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "paid_at" timestamp,
  "raw_payload" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portal_payments_paystack_reference_unique" UNIQUE("paystack_reference")
);

CREATE TABLE IF NOT EXISTS "portal_renewals" (
  "id" serial PRIMARY KEY NOT NULL,
  "client_id" integer NOT NULL,
  "project_id" integer,
  "title" text NOT NULL,
  "service_name" text DEFAULT '' NOT NULL,
  "currency" text DEFAULT 'NGN' NOT NULL,
  "amount" integer,
  "renewal_date" timestamp NOT NULL,
  "status" text DEFAULT 'upcoming' NOT NULL,
  "notes" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "portal_updates" (
  "id" serial PRIMARY KEY NOT NULL,
  "project_id" integer NOT NULL,
  "message" text NOT NULL,
  "created_by" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "portal_projects" ADD CONSTRAINT "portal_projects_client_id_portal_clients_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "public"."portal_clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_milestones" ADD CONSTRAINT "portal_milestones_project_id_portal_projects_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "public"."portal_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_invoices" ADD CONSTRAINT "portal_invoices_client_id_portal_clients_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "public"."portal_clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_invoices" ADD CONSTRAINT "portal_invoices_project_id_portal_projects_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "public"."portal_projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_invoices" ADD CONSTRAINT "portal_invoices_milestone_id_portal_milestones_id_fk"
    FOREIGN KEY ("milestone_id") REFERENCES "public"."portal_milestones"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_payments" ADD CONSTRAINT "portal_payments_invoice_id_portal_invoices_id_fk"
    FOREIGN KEY ("invoice_id") REFERENCES "public"."portal_invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_renewals" ADD CONSTRAINT "portal_renewals_client_id_portal_clients_id_fk"
    FOREIGN KEY ("client_id") REFERENCES "public"."portal_clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_renewals" ADD CONSTRAINT "portal_renewals_project_id_portal_projects_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "public"."portal_projects"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "portal_updates" ADD CONSTRAINT "portal_updates_project_id_portal_projects_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "public"."portal_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "portal_projects_client_idx" ON "portal_projects" ("client_id");
CREATE INDEX IF NOT EXISTS "portal_milestones_project_idx" ON "portal_milestones" ("project_id");
CREATE INDEX IF NOT EXISTS "portal_invoices_client_idx" ON "portal_invoices" ("client_id");
CREATE INDEX IF NOT EXISTS "portal_invoices_milestone_idx" ON "portal_invoices" ("milestone_id");
CREATE INDEX IF NOT EXISTS "portal_payments_invoice_idx" ON "portal_payments" ("invoice_id");
CREATE INDEX IF NOT EXISTS "portal_renewals_client_idx" ON "portal_renewals" ("client_id");
CREATE INDEX IF NOT EXISTS "portal_updates_project_idx" ON "portal_updates" ("project_id");
