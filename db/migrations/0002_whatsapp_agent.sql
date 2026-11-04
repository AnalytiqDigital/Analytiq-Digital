-- WhatsApp AI agent tables.
-- Apply with: npm run db:push  (or paste into your Postgres/Turso console)

CREATE TABLE IF NOT EXISTS "wa_contacts" (
  "id" serial PRIMARY KEY NOT NULL,
  "phone" text NOT NULL,
  "name" text DEFAULT '' NOT NULL,
  "email" text,
  "ai_paused" boolean DEFAULT false NOT NULL,
  "last_message_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "wa_contacts_phone_unique" UNIQUE("phone")
);

CREATE TABLE IF NOT EXISTS "wa_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "contact_id" integer NOT NULL,
  "wa_message_id" text,
  "direction" text NOT NULL,
  "body" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'received' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "wa_messages_wa_message_id_unique" UNIQUE("wa_message_id")
);

CREATE TABLE IF NOT EXISTS "wa_webhook_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "event_key" text NOT NULL,
  "event_type" text NOT NULL,
  "payload" jsonb NOT NULL,
  "processed_at" timestamp,
  "processing_error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "wa_webhook_events_event_key_unique" UNIQUE("event_key")
);

CREATE TABLE IF NOT EXISTS "wa_agent_replies" (
  "id" serial PRIMARY KEY NOT NULL,
  "inbound_message_id" integer NOT NULL,
  "reply_text" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "wa_agent_replies_inbound_message_id_unique" UNIQUE("inbound_message_id")
);

DO $$ BEGIN
  ALTER TABLE "wa_messages" ADD CONSTRAINT "wa_messages_contact_id_wa_contacts_id_fk"
    FOREIGN KEY ("contact_id") REFERENCES "public"."wa_contacts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "wa_agent_replies" ADD CONSTRAINT "wa_agent_replies_inbound_message_id_wa_messages_id_fk"
    FOREIGN KEY ("inbound_message_id") REFERENCES "public"."wa_messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "wa_messages_contact_idx" ON "wa_messages" ("contact_id");
CREATE INDEX IF NOT EXISTS "wa_contacts_last_message_idx" ON "wa_contacts" ("last_message_at");
