import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalPayments } from '@/db/schema-portal';
import { siteConfig } from '@/lib/site-config';

// Server-only Paystack helpers. Amounts in our DB are stored in MAJOR units
// (e.g. 450000 = ₦450,000); Paystack wants the lowest denomination, so we
// multiply by 100 (kobo / pesewas / cents) on the way out.

export function getPaystackSecret(): string {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not configured. Add it to .env.local (see .env.example) to accept online payments.',
    );
  }
  return secret;
}

export function toMinorUnits(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}

export function toMajorUnits(amountMinor: number): number {
  return Math.round(amountMinor / 100);
}

export function portalCallbackUrl(invoiceId: number): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, '');
  return `${base}/api/portal/pay/callback?invoiceId=${invoiceId}`;
}

interface InitializeArgs {
  email: string;
  amountMajor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializePaystackTransaction(args: InitializeArgs): Promise<{
  authorizationUrl: string;
  reference: string;
}> {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getPaystackSecret()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: args.email,
      amount: toMinorUnits(args.amountMajor),
      currency: args.currency.toUpperCase(),
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata || {},
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status || !data?.data?.authorization_url) {
    throw new Error(data?.message || 'Paystack failed to initialize the transaction.');
  }
  return { authorizationUrl: data.data.authorization_url as string, reference: data.data.reference as string };
}

export interface PaystackVerifyData {
  status: string;
  reference: string;
  amountMinor: number;
  currency: string;
  channel?: string;
  paidAt?: string;
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyData> {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getPaystackSecret()}` },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status || !data?.data) {
    throw new Error(data?.message || 'Paystack could not verify this transaction.');
  }
  const d = data.data;
  return {
    status: d.status as string,
    reference: d.reference as string,
    amountMinor: d.amount as number,
    currency: d.currency as string,
    channel: d.channel as string | undefined,
    paidAt: (d.paid_at as string | undefined) || undefined,
  };
}

/** HMAC-SHA512 check for the x-paystack-signature webhook header. */
export function isValidPaystackSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return false;
  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function buildPaymentReference(invoiceId: number): string {
  return `AQ-${invoiceId}-${Date.now()}`;
}

export interface RecordPaymentArgs {
  reference: string;
  channel?: string;
  rawPayload: string;
}

/**
 * Idempotently finalize a payment: flip the pending payment row to success,
 * then roll its amount into the invoice. Safe to call from both the webhook
 * and the browser callback — the second call is a no-op.
 */
export async function recordSuccessfulPortalPayment(args: RecordPaymentArgs): Promise<{ alreadyRecorded: boolean }> {
  const payments = await db
    .select()
    .from(portalPayments)
    .where(eq(portalPayments.paystackReference, args.reference))
    .limit(1);
  const payment = payments[0];
  if (!payment) {
    throw new Error(`No payment found for reference ${args.reference}.`);
  }
  if (payment.status === 'success') {
    return { alreadyRecorded: true };
  }

  const invoices = await db
    .select()
    .from(portalInvoices)
    .where(eq(portalInvoices.id, payment.invoiceId))
    .limit(1);
  const invoice = invoices[0];
  if (!invoice) {
    throw new Error(`Invoice ${payment.invoiceId} for payment ${args.reference} no longer exists.`);
  }

  await db
    .update(portalPayments)
    .set({ status: 'success', channel: args.channel || payment.channel, paidAt: new Date(), rawPayload: args.rawPayload })
    .where(eq(portalPayments.id, payment.id));

  // Only roll same-currency amounts into the invoice total.
  const applies = payment.currency.toUpperCase() === invoice.currency.toUpperCase();
  const newPaid = applies ? invoice.amountPaid + payment.amount : invoice.amountPaid;
  const fullyPaid = applies && newPaid >= invoice.amount;
  await db
    .update(portalInvoices)
    .set({
      amountPaid: newPaid,
      status: fullyPaid ? 'paid' : applies && newPaid > 0 ? 'partial' : invoice.status,
      paidAt: fullyPaid ? new Date() : invoice.paidAt,
      updatedAt: new Date(),
    })
    .where(eq(portalInvoices.id, invoice.id));

  return { alreadyRecorded: false };
}
