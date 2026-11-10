import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { formatPortalAmount, invoiceStatusColors } from '@/lib/portal';
import { groupOpenBalancesByCurrency, isDisplayOverdue } from '@/lib/portal-resources';

export const dynamic = 'force-dynamic';

export default async function PortalInvoicesPage() {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  const invoices = await db
    .select()
    .from(portalInvoices)
    .where(eq(portalInvoices.clientId, session.clientId))
    .orderBy(desc(portalInvoices.createdAt));

  const open = invoices.filter((i) => ['sent', 'partial', 'overdue'].includes(i.status));
  // Balances are grouped by currency — cross-currency sums are never merged.
  const openByCurrency = groupOpenBalancesByCurrency(open);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Invoices</h1>
      <p className="mt-1 text-sm text-ink/60">
        {open.length === 0
          ? 'All settled — no outstanding invoices.'
          : `${open.length} open invoice${open.length > 1 ? 's' : ''} · ${[...openByCurrency.entries()]
              .map(([code, total]) => `${formatPortalAmount(total, code)} outstanding`)
              .join(' · ')}`}
      </p>

      {invoices.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
          No invoices yet — they&apos;ll appear here when we bill a milestone.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-surface-off text-xs font-semibold uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-off/60">
                  <td className="px-4 py-3">
                    <Link href={`/portal/invoices/${inv.id}`} className="font-semibold text-ink hover:text-brand">
                      {inv.invoiceNumber}
                    </Link>
                    <p className="text-xs text-ink/50">{inv.title}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/80">
                    {formatPortalAmount(inv.amount, inv.currency)}
                    {inv.amountPaid > 0 && inv.status !== 'paid' && (
                      <span className="block text-xs text-ink/50">
                        {formatPortalAmount(inv.amountPaid, inv.currency)} paid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isDisplayOverdue(inv) ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                        overdue
                      </span>
                    ) : (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceStatusColors[inv.status] || 'bg-slate-100 text-slate-700'}`}>
                        {inv.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/portal/invoices/${inv.id}`} className="text-sm font-semibold text-brand hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
