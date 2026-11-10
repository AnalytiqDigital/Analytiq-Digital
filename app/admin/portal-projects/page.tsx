'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PortalResourceManager from '@/components/admin/PortalResourceManager';
import { fetchJson } from '@/lib/fetch-json';

interface ClientOption {
  id: number;
  name: string;
  email: string;
}

export default function AdminPortalProjectsPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);

  useEffect(() => {
    fetchJson<{ data?: ClientOption[] }>('/api/admin/portal/clients')
      .then((d) => setClients((d.data || []).map((c) => ({ id: c.id, name: c.name, email: c.email }))))
      .catch(() => setClients([]));
  }, []);

  const clientOptions = clients.map((c) => ({ value: String(c.id), label: `${c.name} (${c.email})` }));

  return (
    <div>
      <PortalResourceManager
        resource="projects"
        title="Portal Projects"
        subtitle="Projects clients see in their portal, with milestones and progress updates."
        emptyLabel="No portal projects yet."
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'clientId', label: 'Client', render: (r) => clients.find((c) => c.id === r.clientId)?.name || `#${r.clientId}` },
          { key: 'status', label: 'Status' },
          { key: 'progress', label: 'Progress %' },
        ]}
        fields={[
          { name: 'clientId', label: 'Client', type: 'select', options: clientOptions, required: true },
          { name: 'title', label: 'Project title', type: 'text', required: true, fullWidth: true },
          { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
          { name: 'serviceSlug', label: 'Service slug', type: 'text', help: 'e.g. website-development' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['Discovery', 'In Progress', 'Review', 'Completed', 'On Hold'],
          },
          { name: 'progress', label: 'Progress % (auto-updated from milestones)', type: 'number' },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'dueDate', label: 'Due date', type: 'date' },
        ]}
      />
      <p className="mt-4 text-sm text-ink/60">
        Manage milestones and client-visible updates per project:{' '}
        <Link href="/admin/portal-milestones" className="font-semibold text-brand hover:underline">Milestones</Link>
        {' · '}
        <Link href="/admin/portal-updates" className="font-semibold text-brand hover:underline">Updates</Link>
      </p>
    </div>
  );
}
