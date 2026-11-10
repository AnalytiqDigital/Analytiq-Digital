import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { portalPayments } from '@/db/schema-portal';
import { recordSuccessfulPortalPayment, verifyPaystackTransaction } from '@/lib/paystack';

// The `invoiceId` query param comes from our own initialize call, but it is
// still untrusted browser input — only digits are accepted, otherwise we fall
// back to the invoice the verified payment actually belongs to.
function sanitizeInvoiceId(raw: string | null): string | null {
  return raw && /^\d+$/.test(raw) ? raw : null;
}

function invoiceUrl(invoiceId: string | null, params: URLSearchParams): string {
  const safe = sanitizeInvoiceId(invoiceId);
  const base = safe ? `/portal/invoices/${safe}` : '/portal/invoices';
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref');
  const invoiceId = sanitizeInvoiceId(url.searchParams.get('invoiceId'));

  if (!reference) {
    return NextResponse.redirect(new URL(invoiceUrl(invoiceId, new URLSearchParams({ error: 'missing-reference' })), request.url));
  }

  try {
    const data = await verifyPaystackTransaction(reference);
    if (data.status === 'success') {
      await recordSuccessfulPortalPayment({
        reference: data.reference,
        channel: data.channel,
        rawPayload: JSON.stringify({ verifiedAt: new Date().toISOString(), verify: data }),
      });
      // Redirect to the invoice the payment actually settled — not blindly to
      // the query param — so a tampered `invoiceId` can't misdirect the user.
      let settledId = invoiceId;
      try {
        const rows = await db
          .select({ invoiceId: portalPayments.invoiceId })
          .from(portalPayments)
          .where(eq(portalPayments.paystackReference, data.reference))
          .limit(1);
        if (rows[0]) settledId = String(rows[0].invoiceId);
      } catch {
        // Fall through to the sanitized query param on lookup failure.
      }
      return NextResponse.redirect(new URL(invoiceUrl(settledId, new URLSearchParams({ paid: '1' })), request.url));
    }
    return NextResponse.redirect(
      new URL(invoiceUrl(invoiceId, new URLSearchParams({ error: `payment-${data.status}` })), request.url),
    );
  } catch (err) {
    console.error('Paystack callback error:', err);
    return NextResponse.redirect(
      new URL(invoiceUrl(invoiceId, new URLSearchParams({ error: 'verification-failed' })), request.url),
    );
  }
}
