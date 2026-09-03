'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminCaseStudiesPage() {
  return (
    <ResourceManager
      resource="case-studies"
      title="Case Studies"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'industry', label: 'Industry' },
        { key: 'published', label: 'Published', render: (r) => (r.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug (URL path)', type: 'text', required: true },
        { name: 'client', label: 'Client (or "withheld by request")', type: 'text' },
        { name: 'industry', label: 'Industry', type: 'text' },
        { name: 'serviceSlug', label: 'Related service slug', type: 'text', help: 'e.g. power-bi-dashboards' },
        { name: 'summary', label: 'Summary', type: 'textarea', required: true },
        { name: 'challenge', label: 'Challenge', type: 'textarea', required: true },
        { name: 'approach', label: 'Approach', type: 'textarea', required: true },
        { name: 'solution', label: 'Solution', type: 'textarea', required: true },
        { name: 'results', label: 'Results', type: 'tags', help: 'Comma-separated list of result bullets' },
        { name: 'tech', label: 'Technologies used', type: 'tags', help: 'Comma-separated list' },
        { name: 'image', label: 'Image URL', type: 'url' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
    />
  );
}
