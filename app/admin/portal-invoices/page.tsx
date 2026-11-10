'use client';

import { useEffect, useState } from 'react';
import PortalResourceManager from '@/components/admin/PortalResourceManager';

export default function AdminPortalInvoicesPage() {
  const [clients, setClients] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: number; title: string; clientId: number }>>([]);
  const [milestones, setMilestones] = useState<Array<{ id: number; title: string; projectId: number }>>([]);

  useEffect(() => {
    fetch('/api/admin/portal/clients')
      .then((r) => r.json())
      .then((d) => setClients(d.data || []))
      .catch(() => setClients([]));
    fetch('/api/admin/portal/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.data || []))
      .catch(() => setProjects([]));
    fetch('/api/admin/portal/milestones')
      .then((r) => r.json())
      .then((d) => setMilestones((d.data || []).map((m: any) => ({ id: m.id, title: m.title, projectId: m.projectId }))))
      .catch(() => setMilestones([]));
  }, []);

  const clientOptions = clients.map((c) => ({ value: String(c.id), label: `${c.name} (${c.email})` }));
  const projectOptions = [{ value: '', label: '— none —' }].concat(
    projects.map((p) => {
      const owner = clients.find((c) => c.id === p.clientId);
      return { value: String(p.id), label: `#${p.id} · ${p.title}${owner ? ` (${owner.name})` : ''}` };
    }),
  );
  // Note: PortalResourceManager has no cross-field filtering, so all milestones
  // are listed with their project id; the server rejects a milestone that does
  // not belong to the chosen project.
  const milestoneOptions = [{ value: '', label: '— none —' }].concat(
    milestones.map((m) => ({ value: String(m.id), label: `#${m.id} · ${m.title} (project #${m.projectId})` })),
  );

  return (
    <PortalResourceManager
      resource="invoices"
      title="Portal Invoices"
      subtitle="Create in any currency (NGN, USD, GHS, EUR…). Paystack charges NGN, USD, GHS, ZAR, KES and RWF online — others fall back to bank transfer. Outstanding totals are grouped per currency, never summed across currencies."
      emptyLabel="No invoices yet."
      columns={[
        { key: 'invoiceNumber', label: 'Number' },
        { key: 'title', label: 'Title' },
        {
          key: 'amount',
          label: 'Amount',
          render: (r) => `${r.currency} ${Number(r.amount || 0).toLocaleString('en-NG')} (${r.status})`,
        },
      ]}
      fields={[
        { name: 'clientId', label: 'Client', type: 'select', options: clientOptions, required: true, fullWidth: true },
        { name: 'projectId', label: 'Project (optional)', type: 'select', options: projectOptions, fullWidth: true },
        {
          name: 'milestoneId',
          label: 'Milestone (optional — must belong to the project above)',
          type: 'select',
          options: milestoneOptions,
          fullWidth: true,
          help: 'Filtered client-side after load; server validates the milestone belongs to the project.',
        },
        { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true, placeholder: 'e.g. Website build — milestone 1 deposit' },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        { name: 'currency', label: 'Currency (ISO code)', type: 'text', required: true, placeholder: 'NGN', help: 'Any 3-letter code: NGN, USD, GHS, EUR, GBP, KES…' },
        { name: 'amount', label: 'Amount (major units)', type: 'number', required: true, help: 'e.g. 450000 = ₦450,000. Multiplied by 100 only when talking to Paystack.' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled'],
          help: 'Only sent / partial / overdue invoices are payable by the client.',
        },
        { name: 'dueDate', label: 'Due date', type: 'date' },
        { name: 'notes', label: 'Notes (bank-transfer instructions shown to client where relevant)', type: 'textarea', fullWidth: true },
      ]}
    />
  );
}
