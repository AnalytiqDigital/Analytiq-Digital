import { pgTable, text, integer, serial, timestamp } from 'drizzle-orm/pg-core';

// Client portal tables. Clients are separate from admin `users` — they get
// their own session cookie (see lib/portal-auth) so a client login never
// grants /admin access and vice versa.

export const portalClients = pgTable('portal_clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  company: text('company'),
  phone: text('phone'),
  // active | invited | disabled
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portalProjects = pgTable('portal_projects', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => portalClients.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  serviceSlug: text('service_slug'),
  // Discovery | In Progress | Review | Completed | On Hold
  status: text('status').notNull().default('Discovery'),
  progress: integer('progress').notNull().default(0),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portalMilestones = pgTable('portal_milestones', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => portalProjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  // pending | in_progress | completed
  status: text('status').notNull().default('pending'),
  sortOrder: integer('sort_order').notNull().default(0),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portalInvoices = pgTable('portal_invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  clientId: integer('client_id')
    .notNull()
    .references(() => portalClients.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').references(() => portalProjects.id, {
    onDelete: 'set null',
  }),
  milestoneId: integer('milestone_id').references(() => portalMilestones.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  // ISO 4217 code entered by admin: NGN, USD, GHS, EUR, GBP, KES, ZAR, ...
  currency: text('currency').notNull().default('NGN'),
  // Amount in MAJOR units (e.g. 450000 = ₦450,000 / $450,000). Multiplied by
  // 100 only when talking to Paystack (kobo/cents).
  amount: integer('amount').notNull(),
  // draft | sent | partial | paid | overdue | cancelled
  status: text('status').notNull().default('draft'),
  amountPaid: integer('amount_paid').notNull().default(0),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  // Bank-transfer fallback for currencies Paystack can't charge.
  paystackReference: text('paystack_reference'),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portalPayments = pgTable('portal_payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id')
    .notNull()
    .references(() => portalInvoices.id, { onDelete: 'cascade' }),
  currency: text('currency').notNull().default('NGN'),
  // Amount in MAJOR units, matching the invoice.
  amount: integer('amount').notNull(),
  paystackReference: text('paystack_reference').unique(),
  channel: text('channel'),
  // pending | success | failed | manual
  status: text('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  rawPayload: text('raw_payload').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const portalRenewals = pgTable('portal_renewals', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => portalClients.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').references(() => portalProjects.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  serviceName: text('service_name').notNull().default(''),
  currency: text('currency').notNull().default('NGN'),
  amount: integer('amount'),
  renewalDate: timestamp('renewal_date').notNull(),
  // upcoming | due | renewed | expired
  status: text('status').notNull().default('upcoming'),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portalUpdates = pgTable('portal_updates', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => portalProjects.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdBy: text('created_by').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Currencies Paystack can charge directly (card/bank/transfer). Anything else
// falls back to a bank-transfer instruction on the invoice.
export const PAYSTACK_SUPPORTED_CURRENCIES = new Set(['NGN', 'USD', 'GHS', 'ZAR', 'KES', 'RWF']);

export function isPaystackCurrency(currency: string): boolean {
  return PAYSTACK_SUPPORTED_CURRENCIES.has(currency.toUpperCase());
}

const INVOICE_PREFIX = 'AQ';

export function buildInvoiceNumber(id: number): string {
  return `${INVOICE_PREFIX}-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
}

/** Format a major-units amount with its currency code, e.g. "₦450,000" or "USD 2,500". */
export function formatPortalAmount(amountMajor: number, currency: string): string {
  const code = (currency || 'NGN').toUpperCase();
  try {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(amountMajor);
    // Unknown codes don't throw on all ICU builds — they render with the
    // generic ¤ sign. Use an explicit CODE prefix instead.
    if (formatted.includes('¤')) {
      return `${code} ${amountMajor.toLocaleString('en-NG')}`;
    }
    return formatted;
  } catch {
    return `${code} ${amountMajor.toLocaleString('en-NG')}`;
  }
}
