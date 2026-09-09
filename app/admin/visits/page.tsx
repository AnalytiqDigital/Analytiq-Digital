'use client';

import { useEffect, useState } from 'react';

interface VisitorEvent {
  id: number;
  page: string;
  referrer: string | null;
  source: string;
  campaign: string | null;
  createdAt: string;
}

export default function VisitorFeedPage() {
  const [rows, setRows] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load visits');
        setRows((data.data || []).slice().reverse());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load visits');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Visitor Feed</h1>
      <p className="mt-1 text-sm text-ink/60">Live website visits and traffic sources.</p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink/50">Loading visits…</p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
            No visits yet. The tracking script will appear here once someone lands on the site.
          </p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-bold text-ink">{row.page}</p>
                <span className="rounded-full bg-brand/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                  {row.source}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                {row.campaign ? `Campaign: ${row.campaign}` : 'Campaign: general'}
              </p>
              <p className="mt-1 text-sm text-ink/60">
                Referrer: {row.referrer || 'direct'}
              </p>
              <p className="mt-2 text-xs text-ink/45">{new Date(row.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
