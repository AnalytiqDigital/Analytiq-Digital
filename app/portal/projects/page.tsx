import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalMilestones, portalProjects } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { projectStatusColors } from '@/lib/portal';

export const dynamic = 'force-dynamic';

export default async function PortalProjectsPage() {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  const projects = await db
    .select()
    .from(portalProjects)
    .where(eq(portalProjects.clientId, session.clientId))
    .orderBy(desc(portalProjects.updatedAt));

  const counts = await Promise.all(
    projects.map(async (p) => {
      const ms = await db.select().from(portalMilestones).where(eq(portalMilestones.projectId, p.id));
      return { id: p.id, total: ms.length, done: ms.filter((m) => m.status === 'completed').length };
    }),
  );
  const countById = new Map(counts.map((c) => [c.id, c]));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
      <p className="mt-1 text-sm text-ink/60">Milestones, progress and updates from our team.</p>

      {projects.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
          No projects yet — your work with us will appear here.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const c = countById.get(p.id);
            return (
              <Link
                key={p.id}
                href={`/portal/projects/${p.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display font-bold text-ink">{p.title}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${projectStatusColors[p.status] || 'bg-slate-100 text-slate-700'}`}>
                    {p.status}
                  </span>
                </div>
                {p.description && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{p.description}</p>}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-ink/50">
                    <span>{p.progress}% complete</span>
                    <span>{c ? `${c.done}/${c.total} milestones` : ''}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-brand" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
