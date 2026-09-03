'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminServicesPage() {
  return (
    <ResourceManager
      resource="services"
      title="Services"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'fromPrice', label: 'From price' },
        { key: 'published', label: 'Published', render: (r) => (r.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'slug', label: 'Slug (URL path)', type: 'text', required: true, help: 'e.g. website-development' },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          options: ['globe', 'cpu', 'bar-chart', 'code', 'message-circle', 'compass'],
        },
        { name: 'shortDescription', label: 'Short description', type: 'textarea', required: true },
        { name: 'description', label: 'Full description', type: 'textarea' },
        { name: 'benefits', label: 'Benefits', type: 'tags', help: 'Comma-separated list' },
        { name: 'fromPrice', label: 'From price', type: 'text', placeholder: '₦300,000' },
        { name: 'image', label: 'Image URL', type: 'url' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
    />
  );
}
