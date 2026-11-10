'use client';

import { useEffect, useState } from 'react';
import PortalResourceManager from '@/components/admin/PortalResourceManager';

export default function AdminPortalUpdatesPage() {
  const [projects, setProjects] = useState<Array<{ id: number; title: string }>>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/portal/projects').then((r) => r.json()),
      fetch('/api/admin/portal/clients').then((r) => r.json()),
    ])
      .then(([p, c]) => {
        const clients: any[] = c.data || [];
        const nameById = new Map(clients.map((cl: any) => [cl.id, cl.name]));
        setProjects(
          ((p.data || []) as any[]).map((pr: any) => ({
            id: pr.id,
            title: `${pr.title} (${nameById.get(pr.clientId) || `#${pr.clientId}`})`,
          })),
        );
      })
      .catch(() => setProjects([]));
  }, []);

  const projectOptions = projects.map((p) => ({ value: String(p.id), label: `#${p.id} · ${p.title}` }));

  return (
    <PortalResourceManager
      resource="updates"
      title="Portal Updates"
      subtitle="Progress notes clients see on their project page, newest first."
      emptyLabel="No updates yet."
      columns={[
        { key: 'message', label: 'Message' },
        { key: 'projectId', label: 'Project', render: (r) => projects.find((p) => p.id === r.projectId)?.title || `#${r.projectId}` },
        { key: 'createdBy', label: 'By' },
      ]}
      fields={[
        { name: 'projectId', label: 'Project', type: 'select', options: projectOptions, required: true, fullWidth: true },
        { name: 'message', label: 'Update', type: 'textarea', required: true, fullWidth: true },
        { name: 'createdBy', label: 'Author (shown to client)', type: 'text', placeholder: 'e.g. Mekan' },
      ]}
    />
  );
}
