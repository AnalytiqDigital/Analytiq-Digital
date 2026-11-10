import { getTableColumns, eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  portalClients,
  portalInvoices,
  portalMilestones,
  portalProjects,
  portalRenewals,
  portalUpdates,
  buildInvoiceNumber,
} from '@/db/schema-portal';
import { buildRecordValues, InvalidFieldError, PROTECTED_COLUMNS } from './admin-resources';

// Admin-managed portal resources, exposed at /api/admin/portal/[resource].
// Payments are intentionally excluded — they are written only by the
// Paystack initialize/callback/webhook flow, never by hand.
export const portalResourceTables = {
  clients: portalClients,
  projects: portalProjects,
  milestones: portalMilestones,
  invoices: portalInvoices,
  renewals: portalRenewals,
  updates: portalUpdates,
} as const;

export type PortalResourceName = keyof typeof portalResourceTables;

export function isValidPortalResource(name: string): name is PortalResourceName {
  return Object.prototype.hasOwnProperty.call(portalResourceTables, name);
}

function randomPassword(length = 12): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join('');
}

/** Strip secrets before sending rows to the admin UI. */
export function sanitizePortalRow(resource: PortalResourceName, row: Record<string, any>) {
  if (resource === 'clients') {
    const { passwordHash, ...rest } = row;
    return rest;
  }
  return row;
}

export interface PreparedCreate {
  values: Record<string, unknown>;
  /** Returned once to the admin (e.g. an auto-generated client password). Never stored in plain text. */
  extra?: Record<string, unknown>;
}

export async function preparePortalCreate(
  resource: PortalResourceName,
  body: Record<string, unknown>,
  hashPassword: (plain: string) => Promise<string>,
): Promise<PreparedCreate> {
  const table = portalResourceTables[resource];
  const columns = getTableColumns(table as any);
  const values = buildRecordValues(columns as any, body);

  if (resource === 'clients') {
    const v = values as Record<string, unknown>;
    if (typeof v.email === 'string') v.email = v.email.trim().toLowerCase();
    let plain = typeof body.password === 'string' ? body.password.trim() : '';
    let generated = false;
    if (!plain) {
      plain = randomPassword();
      generated = true;
    }
    if (plain.length < 8) {
      throw new InvalidFieldError('password', 'Password must be at least 8 characters.');
    }
    v.passwordHash = await hashPassword(plain);
    return { values: v, extra: generated ? { tempPassword: plain } : undefined };
  }

  if (resource === 'projects') {
    const v = values as Record<string, unknown>;
    if (typeof v.clientId !== 'number') {
      throw new InvalidFieldError('clientId', 'A project needs a client.');
    }
    if (typeof v.status !== 'string' || !v.status) v.status = 'Discovery';
    if (typeof v.progress !== 'number') v.progress = 0;
    return { values: v };
  }

  if (resource === 'milestones') {
    const v = values as Record<string, unknown>;
    if (typeof v.projectId !== 'number') {
      throw new InvalidFieldError('projectId', 'A milestone needs a project.');
    }
    if (typeof v.status !== 'string' || !v.status) v.status = 'pending';
    if (typeof v.sortOrder !== 'number') v.sortOrder = 0;
    return { values: v };
  }

  if (resource === 'updates') {
    const v = values as Record<string, unknown>;
    if (typeof v.projectId !== 'number') {
      throw new InvalidFieldError('projectId', 'An update needs a project.');
    }
    if (typeof v.createdBy !== 'string') v.createdBy = '';
    return { values: v };
  }

  if (resource === 'renewals') {
    const v = values as Record<string, unknown>;
    if (typeof v.clientId !== 'number') {
      throw new InvalidFieldError('clientId', 'A renewal needs a client.');
    }
    if (typeof v.currency === 'string') v.currency = v.currency.trim().toUpperCase() || 'NGN';
    if (typeof v.status !== 'string' || !v.status) v.status = 'upcoming';
    return { values: v };
  }

  if (resource === 'invoices') {
    const v = values as Record<string, unknown>;
    if (typeof v.currency === 'string') v.currency = v.currency.trim().toUpperCase() || 'NGN';
    if (typeof v.clientId !== 'number') {
      throw new InvalidFieldError('clientId', 'An invoice needs a client.');
    }
    if (typeof v.amount !== 'number' || v.amount <= 0) {
      throw new InvalidFieldError('amount', 'Amount must be greater than zero.');
    }
    if (v.milestoneId != null) {
      await assertMilestoneInProject(v.milestoneId, v.projectId);
    }
    // Invoice numbers are final (unique); mint a temp one, then finalize with the real id.
    if (!v.invoiceNumber) v.invoiceNumber = `TEMP-${Date.now()}`;
    if (!v.status) v.status = 'draft';
    return { values: v };
  }

  return { values };
}

/** A linked milestone must exist and belong to the invoice's project. */
export async function assertMilestoneInProject(
  milestoneId: unknown,
  projectId: unknown,
): Promise<void> {
  if (typeof milestoneId !== 'number') {
    throw new InvalidFieldError('milestoneId', 'Invalid milestone.');
  }
  const rows = await db
    .select()
    .from(portalMilestones)
    .where(eq(portalMilestones.id, milestoneId))
    .limit(1);
  const milestone = rows[0];
  if (!milestone) {
    throw new InvalidFieldError('milestoneId', 'Milestone not found.');
  }
  if (projectId == null) {
    throw new InvalidFieldError('projectId', 'An invoice linked to a milestone needs a project.');
  }
  if (milestone.projectId !== projectId) {
    throw new InvalidFieldError('milestoneId', 'Milestone does not belong to this project.');
  }
}

/** After an invoice row exists with its real id, finalize a temp invoice number. */
export async function finalizeInvoiceNumber(id: number, invoiceNumber: unknown): Promise<string | null> {
  if (typeof invoiceNumber === 'string' && !invoiceNumber.startsWith('TEMP-')) return null;
  const final = buildInvoiceNumber(id);
  await db.update(portalInvoices).set({ invoiceNumber: final }).where(eq(portalInvoices.id, id));
  return final;
}

export async function preparePortalUpdate(
  resource: PortalResourceName,
  body: Record<string, unknown>,
  hashPassword: (plain: string) => Promise<string>,
  currentId?: number,
): Promise<Record<string, unknown>> {
  const table = portalResourceTables[resource];
  const columns = getTableColumns(table as any);
  const values = buildRecordValues(columns as any, body);
  // passwordHash is a real column but must never be set directly.
  delete (values as Record<string, unknown>).passwordHash;

  if (resource === 'clients') {
    const v = values as Record<string, unknown>;
    if (typeof v.email === 'string') v.email = v.email.trim().toLowerCase();
    const plain = typeof (body as Record<string, unknown>).password === 'string'
      ? ((body as Record<string, unknown>).password as string).trim()
      : '';
    if (plain) {
      if (plain.length < 8) {
        const { InvalidFieldError } = await import('./admin-resources');
        throw new InvalidFieldError('password', 'Password must be at least 8 characters.');
      }
      v.passwordHash = await hashPassword(plain);
    }
  }

  if (resource === 'renewals') {
    const v = values as Record<string, unknown>;
    if (typeof v.currency === 'string') v.currency = v.currency.trim().toUpperCase() || 'NGN';
  }

  if (resource === 'invoices') {
    const v = values as Record<string, unknown>;
    if (typeof v.currency === 'string') v.currency = v.currency.trim().toUpperCase() || 'NGN';
    if (
      (v.milestoneId !== undefined || v.projectId !== undefined) &&
      currentId != null
    ) {
      const current = await db
        .select()
        .from(portalInvoices)
        .where(eq(portalInvoices.id, currentId))
        .limit(1);
      const milestoneId =
        v.milestoneId !== undefined ? v.milestoneId : (current[0] as any)?.milestoneId ?? null;
      const projectId =
        v.projectId !== undefined ? v.projectId : (current[0] as any)?.projectId ?? null;
      if (milestoneId != null) {
        await assertMilestoneInProject(milestoneId, projectId);
      }
    } else if (v.milestoneId != null && v.projectId === undefined && currentId == null) {
      // No record context (shouldn't happen via the API) — require a project.
      throw new InvalidFieldError('projectId', 'An invoice linked to a milestone needs a project.');
    }
  }

  if ('updatedAt' in columns) {
    (values as Record<string, unknown>).updatedAt = new Date();
  }
  return values;
}

/** Group open (unpaid) invoice balances by currency — never sum across currencies. */
export function groupOpenBalancesByCurrency(
  invoices: Array<{ status: string; currency: string; amount: number; amountPaid: number }>,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const inv of invoices) {
    if (!['sent', 'partial', 'overdue'].includes(inv.status)) continue;
    const balance = inv.amount - inv.amountPaid;
    if (balance <= 0) continue;
    const code = (inv.currency || 'NGN').toUpperCase();
    totals.set(code, (totals.get(code) || 0) + balance);
  }
  return totals;
}

/** Display-only overdue check: stored status stays `sent`/`partial`, UI shows overdue. */
export function isDisplayOverdue(inv: { status: string; dueDate: Date | string | null }): boolean {
  if (!['sent', 'partial'].includes(inv.status)) return false;
  if (!inv.dueDate) return false;
  return new Date(inv.dueDate).getTime() < Date.now();
}

/**
 * Auto-create a draft invoice stub when a milestone transitions to completed.
 * Only fires on pending|in_progress → completed; re-saving an already-completed
 * milestone is a no-op (guarded by the caller passing the previous status, and
 * by skipping when a stub already exists for the milestone).
 */
export async function maybeCreateMilestoneDraftInvoice(args: {
  milestoneId: number;
  projectId: number;
  clientId: number;
  title: string;
  currency?: string;
  previousStatus: string;
  newStatus: string;
}): Promise<{ created: boolean; invoiceId?: number }> {
  if (args.newStatus !== 'completed') return { created: false };
  if (args.previousStatus === 'completed') return { created: false };

  const existing = await db
    .select({ id: portalInvoices.id })
    .from(portalInvoices)
    .where(eq(portalInvoices.milestoneId, args.milestoneId))
    .limit(1);
  if (existing.length > 0) return { created: false };

  const inserted = (await db
    .insert(portalInvoices)
    .values({
      invoiceNumber: `TEMP-${Date.now()}`,
      clientId: args.clientId,
      projectId: args.projectId,
      milestoneId: args.milestoneId,
      title: args.title || 'Milestone payment',
      currency: (args.currency || 'NGN').toUpperCase(),
      // Placeholder — the admin fills in the real amount. Drafts are not payable.
      amount: 0,
      status: 'draft',
    })
    .returning()) as any[];
  const row = inserted[0];
  await finalizeInvoiceNumber(row.id, row.invoiceNumber);
  return { created: true, invoiceId: row.id };
}

/**
 * Convert a renewal into a payable `sent` invoice. The renewal row itself is
 * left untouched (status stays for the admin to update after payment).
 */
export async function convertRenewalToInvoice(renewalId: number): Promise<{ invoiceId: number; invoiceNumber: string }> {
  const rows = await db
    .select()
    .from(portalRenewals)
    .where(eq(portalRenewals.id, renewalId))
    .limit(1);
  const renewal = rows[0];
  if (!renewal) {
    throw new InvalidFieldError('renewal', 'Renewal not found.');
  }
  if (renewal.amount == null || renewal.amount <= 0) {
    throw new InvalidFieldError('amount', 'Renewal needs an amount greater than zero before invoicing.');
  }
  const inserted = (await db
    .insert(portalInvoices)
    .values({
      invoiceNumber: `TEMP-${Date.now()}`,
      clientId: renewal.clientId,
      projectId: renewal.projectId,
      title: renewal.title,
      description: renewal.serviceName ? `Renewal — ${renewal.serviceName}` : 'Renewal',
      currency: (renewal.currency || 'NGN').toUpperCase(),
      amount: renewal.amount,
      status: 'sent',
      notes: `Converted from renewal #${renewal.id}.`,
    })
    .returning()) as any[];
  const row = inserted[0];
  const final = await finalizeInvoiceNumber(row.id, row.invoiceNumber);
  return { invoiceId: row.id, invoiceNumber: final || row.invoiceNumber };
}

/** Recompute a project's progress % from its milestones (completed / total). */
export async function recomputeProjectProgress(projectId: number): Promise<void> {
  const milestones = await db
    .select()
    .from(portalMilestones)
    .where(eq(portalMilestones.projectId, projectId));
  const progress =
    milestones.length === 0
      ? 0
      : Math.round((milestones.filter((m) => m.status === 'completed').length / milestones.length) * 100);
  await db
    .update(portalProjects)
    .set({ progress, updatedAt: new Date() })
    .where(eq(portalProjects.id, projectId));
}

export { PROTECTED_COLUMNS };
