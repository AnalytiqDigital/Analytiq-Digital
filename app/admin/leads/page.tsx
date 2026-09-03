'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceInterest: string | null;
  budgetRange: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const STATUSES = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'];

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Proposal: 'bg-purple-100 text-purple-700',
  Won: 'bg-green-100 text-green-700',
  Lost: 'bg-slate-200 text-slate-600',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLeads((data.data || []).slice().reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateLead(id: number, changes: Partial<Lead>) {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error('Update failed');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function deleteLead(id: number) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    await load();
  }

  function toggleExpand(lead: Lead) {
    if (expandedId === lead.id) {
      setExpandedId(null);
    } else {
      setExpandedId(lead.id);
      setNoteDraft(lead.notes || '');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Leads</h1>
      <p className="mt-1 text-sm text-ink/60">Enquiries submitted through the contact form.</p>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : leads.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
            No leads yet — they&apos;ll appear here as soon as someone submits the contact form.
          </p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button type="button" onClick={() => toggleExpand(lead)} className="text-left">
                  <p className="font-display font-bold text-ink">{lead.name}</p>
                  <p className="text-sm text-ink/60">
                    {lead.email} {lead.company ? `· ${lead.company}` : ''} {lead.serviceInterest ? `· ${lead.serviceInterest}` : ''}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                    className={`rounded-lg border-0 px-2.5 py-1 text-xs font-semibold ${statusColors[lead.status] || 'bg-slate-100 text-slate-700'}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteLead(lead.id)}
                    className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-700"
                    aria-label="Delete lead"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <p className="text-ink/80">{lead.message}</p>
                  {(lead.phone || lead.budgetRange) && (
                    <p className="text-ink/60">
                      {lead.phone && <>Phone: {lead.phone} </>}
                      {lead.budgetRange && <>· Budget: {lead.budgetRange}</>}
                    </p>
                  )}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink/60">Internal notes</label>
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      onBlur={() => updateLead(lead.id, { notes: noteDraft })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                      placeholder="Add a note about this lead…"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
