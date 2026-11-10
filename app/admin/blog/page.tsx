'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toDateFieldValue } from '@/lib/date-field';
import { fetchJson } from '@/lib/fetch-json';

interface PostRow {
  id: number;
  slug: string;
  title: string;
  status: string;
  category: string;
  publishedAt: string | null;
  updatedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  scheduled: 'bg-amber-100 text-amber-800',
  draft: 'bg-slate-100 text-slate-600',
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<{ data?: PostRow[] }>('/api/admin/blog');
      setRows(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const data = await fetchJson<{ data: { id: number } }>('/api/admin/blog', { method: 'POST' });
      router.push(`/admin/blog/${data.data.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create post');
      setCreating(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await fetchJson(`/api/admin/blog/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink/60">Write in the rich editor — headings, images, CTAs, embeds, AI help.</p>
        </div>
        <button type="button" onClick={handleCreate} disabled={creating} className="btn-primary disabled:opacity-40">
          <Plus size={16} className="mr-1.5" /> {creating ? 'Creating…' : 'New post'}
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-surface-off text-xs font-semibold uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">Loading…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  No posts yet. Click “New post” to start writing.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-off/60">
                  <td className="max-w-xs px-4 py-3">
                    <Link href={`/admin/blog/${row.id}/edit`} className="font-medium text-ink hover:text-brand">
                      {row.title || '(Untitled)'}
                    </Link>
                    <p className="truncate text-xs text-ink/50">/blog/{row.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[row.status] ?? STATUS_STYLES.draft}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{row.category || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{row.publishedAt ? toDateFieldValue(row.publishedAt) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blog/${row.id}/edit`}
                        className="rounded-lg p-1.5 text-ink/60 hover:bg-brand/10 hover:text-brand"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id, row.title)}
                        className="rounded-lg p-1.5 text-ink/60 hover:bg-red-50 hover:text-red-700"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
