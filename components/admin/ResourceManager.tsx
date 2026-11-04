'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Sparkles } from 'lucide-react';
import DatePicker from '@/components/admin/DatePicker';
import { toDateFieldValue } from '@/lib/date-field';

export type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'select' | 'boolean' | 'tags' | 'date';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select
  required?: boolean;
  placeholder?: string;
  help?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: Record<string, any>) => React.ReactNode;
}

interface ResourceManagerProps {
  resource: string;
  title: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  emptyLabel?: string;
  /** Show a "Generate SEO with AI" button that reads the draft from `draftField`. */
  aiAssist?: { draftField: string; titleField?: string };
}

function defaultValuesFor(fields: FieldConfig[]): Record<string, any> {
  const values: Record<string, any> = {};
  for (const f of fields) {
    if (f.type === 'boolean') values[f.name] = false;
    else if (f.type === 'tags') values[f.name] = '';
    else values[f.name] = '';
  }
  return values;
}

function rowToFormValues(row: Record<string, any>, fields: FieldConfig[]): Record<string, any> {
  const values: Record<string, any> = {};
  for (const f of fields) {
    const raw = row[f.name];
    if (f.type === 'tags') {
      values[f.name] = Array.isArray(raw) ? raw.join(', ') : raw || '';
    } else if (f.type === 'boolean') {
      values[f.name] = Boolean(raw);
    } else if (f.type === 'date') {
      values[f.name] = toDateFieldValue(raw);
    } else {
      values[f.name] = raw ?? '';
    }
  }
  return values;
}

function formValuesToPayload(values: Record<string, any>, fields: FieldConfig[]): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const f of fields) {
    const val = values[f.name];
    if (f.type === 'tags') {
      payload[f.name] = String(val || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === 'number') {
      payload[f.name] = val === '' ? null : Number(val);
    } else if (f.type === 'boolean') {
      payload[f.name] = Boolean(val);
    } else if (f.type === 'date') {
      payload[f.name] = val ? String(val) : null;
    } else {
      payload[f.name] = val;
    }
  }
  return payload;
}

export default function ResourceManager({ resource, title, columns, fields, emptyLabel, aiAssist }: ResourceManagerProps) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>(defaultValuesFor(fields));
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function generateSeo() {
    if (!aiAssist) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: formValues[aiAssist.draftField] ?? '',
          title: aiAssist.titleField ? formValues[aiAssist.titleField] ?? '' : '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'AI generation failed');
      const s = data.data;
      setFormValues((prev) => ({
        ...prev,
        seoTitle: s.seoTitle || prev.seoTitle,
        seoDescription: s.seoDescription || prev.seoDescription,
        excerpt: s.excerpt || prev.excerpt,
        seoKeywords: s.seoKeywords || prev.seoKeywords,
        // Never change the URL of an existing post; only fill an empty slug.
        slug: prev.slug ? prev.slug : s.slug || prev.slug,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${resource}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setRows(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setFormValues(defaultValuesFor(fields));
    setFormOpen(true);
  }

  function openEdit(row: Record<string, any>) {
    setEditingId(row.id);
    setFormValues(rowToFormValues(row, fields));
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = formValuesToPayload(formValues, fields);
    const url = editingId ? `/api/admin/${resource}/${editingId}` : `/api/admin/${resource}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={16} className="mr-1.5" /> Add new
        </button>
      </div>

      {error && !formOpen && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-surface-off text-xs font-semibold uppercase tracking-wide text-ink/60">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink/50">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-ink/50">
                  {emptyLabel || 'No records yet.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-off/60">
                  {columns.map((col) => (
                    <td key={col.key} className="max-w-xs truncate px-4 py-3 text-ink/80">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded-lg p-1.5 text-ink/60 hover:bg-brand/10 hover:text-brand"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
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

      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">{editingId ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg p-1.5 text-ink/50 hover:bg-surface-off">
                <X size={18} />
              </button>
            </div>

            {error && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {aiAssist && (
                <div className="rounded-xl border border-brand/30 bg-brand/5 p-3">
                  <button type="button" onClick={generateSeo} disabled={generating} className="btn-outline w-full">
                    <Sparkles size={16} className="mr-1.5" />
                    {generating ? 'Generating…' : 'Generate SEO & excerpt with AI'}
                  </button>
                  <p className="mt-1.5 text-xs text-ink/50">
                    Reads the article content and fills the excerpt, SEO title, description, keywords and (if empty) slug.
                  </p>
                </div>
              )}
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      required={field.required}
                      value={formValues[field.name] ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formValues[field.name] ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    >
                      <option value="">Select…</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-sm text-ink/70">
                      <input
                        type="checkbox"
                        checked={Boolean(formValues[field.name])}
                        onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      Yes
                    </label>
                  ) : field.type === 'date' ? (
                    <DatePicker
                      value={formValues[field.name] ?? ''}
                      required={field.required}
                      onChange={(v) => setFormValues((prev) => ({ ...prev, [field.name]: v }))}
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                      required={field.required}
                      value={formValues[field.name] ?? ''}
                      onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    />
                  )}
                  {field.help && <p className="mt-1 text-xs text-ink/50">{field.help}</p>}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
