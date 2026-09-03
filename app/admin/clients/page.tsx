'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminClientsPage() {
  return (
    <ResourceManager
      resource="clients"
      title="Clients"
      emptyLabel="No client logos added yet. The public site shows placeholder slots until you add real ones here."
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'sortOrder', label: 'Order' },
        { key: 'active', label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Client name', type: 'text', required: true },
        { name: 'logoUrl', label: 'Logo URL', type: 'url', required: true, help: 'Upload via Media Library first, then paste the URL here' },
        { name: 'websiteUrl', label: 'Client website URL', type: 'url' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'active', label: 'Active (shown on site)', type: 'boolean' },
      ]}
    />
  );
}
