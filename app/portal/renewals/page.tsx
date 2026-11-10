import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { portalRenewals } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';
import { formatPortalAmount } from '@/lib/portal';

export const dynamic = 'force-dynamic';

const renewalColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  due: 'bg-amber-100 text-amber-700',
  renewed: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
};

function formatDate(d: Date | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PortalRenewalsPage() {
  const session = await getPortalSession();
  if (!session) redirect('/portal/login');

  const renewals = await db.select().from(portalRenewals).where(eq(portalRenewals.clientId, session.clientId));
  renewals.sort((a, b) => new Date(a.renewalDate || 0).getTime() - new Date(b.renewalDate || 0).getTime());

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Renewals</h1>
      <p className="mt-1 text-sm text-ink/60">Hosting, retainers, licenses and subscriptions — never miss a date.</p>

      {renewals.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
          No renewals scheduled — we&apos;ll list hosting, domains and retainers here.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {renewals.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display font-bold text-ink">{r.title}</h2>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${renewalColors[r.status] || 'bg-slate-100 text-slate-700'}`}>
                  {r.status}
                </span>
              </div>
              {r.serviceName && <p className="mt-1 text-sm text-ink/60">{r.serviceName}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-ink/60">Renews {formatDate(r.renewalDate)}</span>
                {r.amount != null && (
                  <span className="font-semibold text-ink">{formatPortalAmount(r.amount, r.currency)}</span>
                )}
              </div>
              {r.notes && <p className="mt-2 text-sm text-ink/60">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
