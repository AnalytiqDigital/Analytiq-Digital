'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Star } from 'lucide-react';

interface Review {
  id: number;
  authorName: string;
  rating: number;
  text: string;
  reviewTime: string | null;
  syncedAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews/sync');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews((data.data || []).slice().reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/reviews/sync', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Synced ${data.synced} new review(s) from Google.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Google Reviews</h1>
          <p className="mt-1 text-sm text-ink/60">Real reviews only — synced from Google, never fabricated.</p>
        </div>
        <button type="button" onClick={handleSync} disabled={syncing} className="btn-primary">
          <RefreshCw size={16} className={`mr-1.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Requires <code className="rounded bg-blue-100 px-1">GOOGLE_PLACES_API_KEY</code> and{' '}
        <code className="rounded bg-blue-100 px-1">GOOGLE_PLACE_ID</code> to be set in your environment. Without
        them, sync will report that Google Reviews isn&apos;t configured yet — this page will never show placeholder
        reviews.
      </div>

      {message && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
          No reviews synced yet. Configure the environment variables above, then click &quot;Sync now&quot;.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-ink">{r.authorName}</p>
                <div className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? 'fill-accent text-accent' : 'text-slate-300'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-ink/70">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
