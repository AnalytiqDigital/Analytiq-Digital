import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalPayments } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { formatPortalAmount, invoiceStatusColors } from '@/lib/portal';
import { isPaystackCurrency } from '@/db/schema-portal';
import PayInvoiceButton from './pay-button';

export const dynamic = 'force-dynamic';

export default async function PortalInvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  const invoiceId = Number(id);
  if (!Number.isInteger(invoiceId)) notFound();

  const rows = await db
    .select()
    .from(portalInvoices)
    .where(and(eq(portalInvoices.id, invoiceId), eq(portalInvoices.clientId, session.clientId)))
    .limit(1);
  const invoice = rows[0];
  if (!invoice) notFound();

  const payments = await db
    .select()
    .from(portalPayments)
    .where(eq(portalPayments.invoiceId, invoice.id))
    .orderBy(desc(portalPayments.createdAt));

  const paidFlag = query.paid === '1';
  const errorFlag = typeof query.error === 'string' ? query.error : null;
  const open = ['sent', 'partial', 'overdue'].includes(invoice.status);
  const balance = invoice.amount - invoice.amountPaid;
  const paystackOk = isPaystackCurrency(invoice.currency);
  const bankDetails = process.env.BANK_TRANSFER_DETAILS || '';

  return (
    <div>
      <Link href="/portal/invoices" className="text-sm font-semibold text-brand hover:underline">
        ← All invoices
      </Link>

      {paidFlag && (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Payment received — thank you. It may take a moment to reflect below.
        </p>
      )}
      {errorFlag && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Payment could not be confirmed{errorFlag ? `: ${errorFlag}` : '.'} Please try again or contact us.
        </p>
      )}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{invoice.invoiceNumber}</h1>
            <p className="mt-1 text-sm text-ink/60">{invoice.title}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${invoiceStatusColors[invoice.status] || 'bg-slate-100 text-slate-700'}`}
          >
            {invoice.status}
          </span>
        </div>

        {invoice.description && <p className="mt-4 text-sm leading-relaxed text-ink/70">{invoice.description}</p>}

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-off p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Amount</dt>
            <dd className="mt-1 font-display text-xl font-bold text-ink">
              {formatPortalAmount(invoice.amount, invoice.currency)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-off p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Paid</dt>
            <dd className="mt-1 font-display text-xl font-bold text-ink">
              {formatPortalAmount(invoice.amountPaid, invoice.currency)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-off p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">Balance</dt>
            <dd className="mt-1 font-display text-xl font-bold text-ink">
              {formatPortalAmount(Math.max(balance, 0), invoice.currency)}
            </dd>
          </div>
        </dl>

        {invoice.dueDate && (
          <p className="mt-4 text-sm text-ink/60">
            Due {new Date(invoice.dueDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}

        {open && balance > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            {paystackOk ? (
              <PayInvoiceButton invoiceId={invoice.id} />
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">Online payment isn&apos;t available for {invoice.currency}.</p>
                <p className="mt-1">Please pay by bank transfer and we&apos;ll mark this invoice paid.</p>
                {bankDetails && <p className="mt-2 whitespace-pre-wrap">{bankDetails}</p>}
                {invoice.notes && <p className="mt-2 whitespace-pre-wrap">{invoice.notes}</p>}
              </div>
            )}
            {paystackOk && (bankDetails || invoice.notes) && (
              <details className="mt-4 text-sm text-ink/60">
                <summary className="cursor-pointer font-semibold text-ink/70">Prefer bank transfer?</summary>
                <div className="mt-2 whitespace-pre-wrap rounded-xl bg-surface-off p-4">
                  {[bankDetails, invoice.notes].filter(Boolean).join('\n\n')}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display font-bold text-ink">Payment history</h2>
        {payments.length === 0 ? (
          <p className="mt-3 text-sm text-ink/60">No payments recorded yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-ink">
                    {formatPortalAmount(p.amount, p.currency)}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {p.status}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {new Date(p.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {p.channel ? ` · ${p.channel}` : ''}
                    {p.paystackReference ? ` · ${p.paystackReference}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
