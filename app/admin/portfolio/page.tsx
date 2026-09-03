'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminPortfolioPage() {
  return (
    <ResourceManager
      resource="portfolio"
      title="Portfolio"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : 'No') },
        { key: 'published', label: 'Published', render: (r) => (r.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug (URL path)', type: 'text', required: true },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: ['Websites', 'Software', 'AI', 'Analytics', 'Automation'],
          required: true,
        },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'technologies', label: 'Technologies', type: 'tags', help: 'Comma-separated list' },
        { name: 'image', label: 'Image URL', type: 'url' },
        { name: 'projectUrl', label: 'Live project URL', type: 'url' },
        { name: 'featured', label: 'Featured', type: 'boolean' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
    />
  );
}
