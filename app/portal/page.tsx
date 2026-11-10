import Link from 'next/link';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalProjects, portalRenewals } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { formatPortalAmount } from '@/lib/portal';
import { groupOpenBalancesByCurrency } from '@/lib/portal-resources';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PortalOverviewPage() {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  // Fetch full lists (per-client sets are small), slice for "recent" display.
  // Outstanding totals are grouped per currency — never summed across currencies.
  const allProjects = await db
    .select()
    .from(portalProjects)
    .where(eq(portalProjects.clientId, session.clientId))
    .orderBy(desc(portalProjects.updatedAt));
  const projects = allProjects.slice(0, 5);

  const allInvoices = await db
    .select()
    .from(portalInvoices)
    .where(eq(portalInvoices.clientId, session.clientId))
    .orderBy(desc(portalInvoices.createdAt));
  const invoices = allInvoices.slice(0, 5);

  const allRenewals = await db
    .select()
    .from(portalRenewals)
    .where(eq(portalRenewals.clientId, session.clientId))
    .orderBy(portalRenewals.renewalDate);

  const outstandingByCurrency = groupOpenBalancesByCurrency(allInvoices);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back, {session.name.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-ink/60">Here&apos;s what&apos;s happening across your projects and invoices.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-ink/60">Active projects</p>
          <p className="mt-1 font-display text-3xl font-bold text-ink">
            {allProjects.filter((p) => p.status !== 'Completed').length}
          </p>
          <Link href="/portal/projects" className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
            View projects →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-ink/60">Outstanding balance{outstandingByCurrency.size > 1 ? 's' : ''}</p>
          <div className="mt-1 space-y-1">
            {outstandingByCurrency.size === 0 ? (
              <p className="font-display text-3xl font-bold text-ink">—</p>
            ) : (
              [...outstandingByCurrency.entries()].map(([code, total]) => (
                <p key={code} className="font-display text-xl font-bold text-ink">
                  {formatPortalAmount(total, code)}
                </p>
              ))
            )}
          </div>
          <Link href="/portal/invoices" className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
            View invoices →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-ink/60">Upcoming renewals</p>
          <p className="mt-1 font-display text-3xl font-bold text-ink">{allRenewals.filter((r) => r.status !== 'renewed').length}</p>
          <Link href="/portal/renewals" className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
            View renewals →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display font-bold text-ink">Recent projects</h2>
          {projects.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No projects yet — your work with us will appear here.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <Link href={`/portal/projects/${p.id}`} className="font-semibold text-ink hover:text-brand">
                      {p.title}
                    </Link>
                    <p className="text-xs text-ink/50">{p.status} · {p.progress}%</p>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-brand" style={{ width: `${p.progress}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display font-bold text-ink">Recent invoices</h2>
          {invoices.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No invoices yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <Link href={`/portal/invoices/${inv.id}`} className="font-semibold text-ink hover:text-brand">
                      {inv.invoiceNumber} · {inv.title}
                    </Link>
                    <p className="text-xs text-ink/50">
                      {formatPortalAmount(inv.amount, inv.currency)} · {inv.status}
                    </p>
                  </div>
                  {['sent', 'partial', 'overdue'].includes(inv.status) && (
                    <Link href={`/portal/invoices/${inv.id}`} className="btn-outline px-4 py-1.5 text-xs">
                      Pay
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
