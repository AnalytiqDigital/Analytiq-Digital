'use client';

import { useEffect, useState } from 'react';
import PortalResourceManager from '@/components/admin/PortalResourceManager';

export default function AdminPortalMilestonesPage() {
  const [projects, setProjects] = useState<Array<{ id: number; title: string; clientName?: string }>>([]);

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
      resource="milestones"
      title="Portal Milestones"
      subtitle="Milestones roll up into each project's progress % automatically."
      emptyLabel="No milestones yet. Add the first one for a project."
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'projectId', label: 'Project', render: (r) => projects.find((p) => p.id === r.projectId)?.title || `#${r.projectId}` },
        { key: 'status', label: 'Status' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      fields={[
        { name: 'projectId', label: 'Project', type: 'select', options: projectOptions, required: true, fullWidth: true },
        { name: 'title', label: 'Milestone title', type: 'text', required: true, fullWidth: true },
        { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['pending', 'in_progress', 'completed'],
          required: true,
        },
        { name: 'sortOrder', label: 'Order', type: 'number' },
        { name: 'dueDate', label: 'Due date', type: 'date' },
      ]}
    />
  );
}
