import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { convertRenewalToInvoice, sanitizePortalRow } from '@/lib/portal-resources';
import { portalInvoices } from '@/db/schema-portal';
import { eq } from 'drizzle-orm';
import { InvalidFieldError } from '@/lib/admin-resources';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Convert a renewal into a payable `sent` invoice. The renewal itself is left
 * untouched — the admin updates its status manually after payment.
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

  const { id } = await params;
  const renewalId = Number(id);
  if (!Number.isInteger(renewalId)) {
    return NextResponse.json({ error: 'Invalid renewal.' }, { status: 400 });
  }

  try {
    const { invoiceId, invoiceNumber } = await convertRenewalToInvoice(renewalId);
    const rows = await db.select().from(portalInvoices).where(eq(portalInvoices.id, invoiceId)).limit(1);
    return NextResponse.json(
      { data: rows[0] ? sanitizePortalRow('invoices', rows[0]) : null, extra: { invoiceId, invoiceNumber } },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to convert renewal' },
      { status: 400 },
    );
  }
}
