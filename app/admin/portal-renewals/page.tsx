'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PortalResourceManager from '@/components/admin/PortalResourceManager';

export default function AdminPortalRenewalsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: number; title: string; clientId: number }>>([]);
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  async function handleConvert(renewalId: number) {
    if (!confirm('Create a payable invoice from this renewal?')) return;
    setConvertingId(renewalId);
    setConvertError(null);
    try {
      const res = await fetch(`/api/admin/portal/renewals/${renewalId}/convert`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Conversion failed.');
      router.push('/admin/portal-invoices');
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : 'Conversion failed.');
      setConvertingId(null);
    }
  }

  useEffect(() => {
    fetch('/api/admin/portal/clients')
      .then((r) => r.json())
      .then((d) => setClients(d.data || []))
      .catch(() => setClients([]));
    fetch('/api/admin/portal/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.data || []))
      .catch(() => setProjects([]));
  }, []);

  const clientOptions = clients.map((c) => ({ value: String(c.id), label: `${c.name} (${c.email})` }));
  const projectOptions = [{ value: '', label: '— none —' }].concat(
    projects.map((p) => {
      const owner = clients.find((c) => c.id === p.clientId);
      return { value: String(p.id), label: `#${p.id} · ${p.title}${owner ? ` (${owner.name})` : ''}` };
    }),
  );

  return (
    <div>
      {convertError && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{convertError}</p>
      )}
    <PortalResourceManager
        resource="renewals"
        title="Portal Renewals"
        subtitle="Hosting, domains, retainers, licenses — the dates clients see so nothing lapses. Convert a renewal into a payable invoice; the renewal status is left for you to update after payment."
        emptyLabel="No renewals scheduled."
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'renewalDate', label: 'Renews', render: (r) => (r.renewalDate ? String(r.renewalDate).slice(0, 10) : '') },
          { key: 'status', label: 'Status' },
          {
            key: 'convert',
            label: 'Invoice',
            render: (r) =>
              r.amount != null && Number(r.amount) > 0 ? (
                <button
                  type="button"
                  disabled={convertingId === r.id}
                  onClick={() => handleConvert(r.id)}
                  className="rounded-lg bg-brand/10 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand/20 disabled:opacity-50"
                >
                  {convertingId === r.id ? 'Creating…' : 'Create invoice'}
                </button>
              ) : (
                <span className="text-xs text-ink/40">needs amount</span>
              ),
          },
        ]}
      fields={[
        { name: 'clientId', label: 'Client', type: 'select', options: clientOptions, required: true, fullWidth: true },
        { name: 'projectId', label: 'Project (optional)', type: 'select', options: projectOptions, fullWidth: true },
        { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true, placeholder: 'e.g. Website hosting & maintenance' },
        { name: 'serviceName', label: 'Service', type: 'text', placeholder: 'e.g. Hosting' },
        { name: 'currency', label: 'Currency', type: 'text', placeholder: 'NGN' },
        { name: 'amount', label: 'Renewal amount', type: 'number' },
        { name: 'renewalDate', label: 'Renewal date', type: 'date', required: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['upcoming', 'due', 'renewed', 'expired'],
        },
        { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
      ]}
    />
    </div>
  );
}
