import { pgTable, text, integer, serial, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// WhatsApp AI agent tables. The database is the source of truth for every
// inbound/outbound message; webhook events are stored first, then processed
// idempotently.

export const waContacts = pgTable('wa_contacts', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull().default(''),
  email: text('email'),
  // When true, the AI agent stays silent so the team can handle the chat.
  aiPaused: boolean('ai_paused').notNull().default(false),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const waMessages = pgTable('wa_messages', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id')
    .notNull()
    .references(() => waContacts.id, { onDelete: 'cascade' }),
  // Meta's message id (wamid.*). Unique so webhook retries never duplicate.
  waMessageId: text('wa_message_id').unique(),
  direction: text('direction').notNull(), // 'in' | 'out'
  body: text('body').notNull().default(''),
  // received | accepted | sent | delivered | read | failed
  status: text('status').notNull().default('received'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const waWebhookEvents = pgTable('wa_webhook_events', {
  id: serial('id').primaryKey(),
  // message id, or `${status.id}:${status.status}` for status callbacks.
  eventKey: text('event_key').notNull().unique(),
  eventType: text('event_type').notNull(), // 'message' | 'status'
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at'),
  processingError: text('processing_error'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const waAgentReplies = pgTable('wa_agent_replies', {
  id: serial('id').primaryKey(),
  // One reply attempt per inbound message; a failed reply is never resent
  // automatically — it stays 'failed' for manual follow-up.
  inboundMessageId: integer('inbound_message_id')
    .notNull()
    .unique()
    .references(() => waMessages.id, { onDelete: 'cascade' }),
  replyText: text('reply_text').notNull().default(''),
  status: text('status').notNull().default('pending'), // pending | sent | failed | skipped
  error: text('error'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
