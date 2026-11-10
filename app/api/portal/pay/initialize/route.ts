import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalPayments } from '@/db/schema-portal';
import { isPaystackCurrency } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import {
  buildPaymentReference,
  initializePaystackTransaction,
  portalCallbackUrl,
} from '@/lib/paystack';

export async function POST(request: Request) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json().catch(() => null);
    const invoiceId = Number(body?.invoiceId);
    if (!Number.isInteger(invoiceId)) {
      return NextResponse.json({ error: 'Invalid invoice.' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(portalInvoices)
      .where(and(eq(portalInvoices.id, invoiceId), eq(portalInvoices.clientId, session.clientId)))
      .limit(1);
    const invoice = rows[0];
    if (!invoice) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    if (!['sent', 'partial', 'overdue'].includes(invoice.status)) {
      return NextResponse.json({ error: 'This invoice is not payable right now.' }, { status: 400 });
    }
    if (!isPaystackCurrency(invoice.currency)) {
      return NextResponse.json(
        { error: `Online payment isn't available for ${invoice.currency}. Please pay by bank transfer.` },
        { status: 400 },
      );
    }

    const balance = invoice.amount - invoice.amountPaid;
    if (balance <= 0) {
      return NextResponse.json({ error: 'This invoice is already paid.' }, { status: 400 });
    }

    const reference = buildPaymentReference(invoice.id);

    // Record the attempt first so the callback/webhook can finalize idempotently.
    await db.insert(portalPayments).values({
      invoiceId: invoice.id,
      currency: invoice.currency,
      amount: balance,
      paystackReference: reference,
      status: 'pending',
      rawPayload: JSON.stringify({ initializedAt: new Date().toISOString(), invoiceId: invoice.id }),
    });

    const { authorizationUrl } = await initializePaystackTransaction({
      email: session.email,
      amountMajor: balance,
      currency: invoice.currency,
      reference,
      callbackUrl: portalCallbackUrl(invoice.id),
      metadata: { invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, clientId: session.clientId },
    });

    return NextResponse.json({ authorizationUrl, reference });
  } catch (err) {
    console.error('Paystack initialize error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not start payment.' },
      { status: 500 },
    );
  }
}
