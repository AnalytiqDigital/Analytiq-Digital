import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalPayments } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invoices = await db
    .select()
    .from(portalInvoices)
    .where(eq(portalInvoices.clientId, session.clientId))
    .orderBy(desc(portalInvoices.createdAt));

  const withHistory = await Promise.all(
    invoices.map(async (inv) => {
      const payments = await db
        .select()
        .from(portalPayments)
        .where(eq(portalPayments.invoiceId, inv.id))
        .orderBy(desc(portalPayments.createdAt));
      return { ...inv, payments };
    }),
  );

  return NextResponse.json({ data: withHistory });
}
