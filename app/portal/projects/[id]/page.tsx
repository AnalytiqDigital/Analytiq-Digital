import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { portalInvoices, portalMilestones, portalProjects, portalUpdates } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { projectStatusColors, milestoneStatusColors, formatPortalAmount } from '@/lib/portal';

export const dynamic = 'force-dynamic';

export default async function PortalProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  const projectId = Number(id);
  if (!Number.isInteger(projectId)) notFound();

  const rows = await db
    .select()
    .from(portalProjects)
    .where(and(eq(portalProjects.id, projectId), eq(portalProjects.clientId, session.clientId)))
    .limit(1);
  const project = rows[0];
  if (!project) notFound();

  const milestones = await db.select().from(portalMilestones).where(eq(portalMilestones.projectId, project.id));
  milestones.sort((a, b) => a.sortOrder - b.sortOrder);
  // Linked invoices per milestone (client-scoped) for billing chips.
  const linkedInvoices =
    milestones.length === 0
      ? []
      : await db
          .select()
          .from(portalInvoices)
          .where(
            and(
              inArray(
                portalInvoices.milestoneId,
                milestones.map((m) => m.id),
              ),
              eq(portalInvoices.clientId, session.clientId),
            ),
          );
  const invoicesByMilestone = new Map<number, typeof linkedInvoices>();
  for (const inv of linkedInvoices) {
    if (inv.milestoneId == null) continue;
    const list = invoicesByMilestone.get(inv.milestoneId) || [];
    list.push(inv);
    invoicesByMilestone.set(inv.milestoneId, list);
  }
  const updates = await db
    .select()
    .from(portalUpdates)
    .where(eq(portalUpdates.projectId, project.id))
    .orderBy(desc(portalUpdates.createdAt));

  return (
    <div>
      <Link href="/portal/projects" className="text-sm font-semibold text-brand hover:underline">← All projects</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{project.title}</h1>
          {project.description && <p className="mt-1 max-w-2xl text-sm text-ink/60">{project.description}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${projectStatusColors[project.status] || 'bg-slate-100 text-slate-700'}`}>
          {project.status} · {project.progress}%
        </span>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-brand" style={{ width: `${project.progress}%` }} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display font-bold text-ink">Milestones</h2>
          {milestones.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">Milestones will appear here as we scope the work.</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {milestones.map((m, i) => (
                <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-ink">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                      {m.title}
                    </p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${milestoneStatusColors[m.status] || 'bg-slate-100 text-slate-700'}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  {m.description && <p className="mt-2 text-sm text-ink/60">{m.description}</p>}
                  {m.dueDate && (
                    <p className="mt-1 text-xs text-ink/50">Due {new Date(m.dueDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  )}
                  {(invoicesByMilestone.get(m.id) || []).map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/portal/invoices/${inv.id}`}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand/20"
                    >
                      {inv.invoiceNumber} · {inv.status}
                      {inv.status !== 'paid' && inv.amountPaid > 0
                        ? ` · ${formatPortalAmount(inv.amountPaid, inv.currency)} of ${formatPortalAmount(inv.amount, inv.currency)}`
                        : ` · ${formatPortalAmount(inv.amount, inv.currency)}`}
                    </Link>
                  ))}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>
          <h2 className="font-display font-bold text-ink">Updates</h2>
          {updates.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No updates yet — we&apos;ll post progress here.</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {updates.map((u) => (
                <li key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-ink/80">{u.message}</p>
                  <p className="mt-2 text-xs text-ink/50">
                    {u.createdBy ? `${u.createdBy} · ` : ''}
                    {new Date(u.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
