'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminBlogPage() {
  return (
    <ResourceManager
      resource="blog"
      title="Blog"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug (URL path)', type: 'text', required: true },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
        { name: 'content', label: 'Content (Markdown)', type: 'textarea', required: true },
        { name: 'featuredImage', label: 'Featured image URL', type: 'url' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'tags', label: 'Tags', type: 'tags', help: 'Comma-separated list' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['draft', 'scheduled', 'published'],
          required: true,
          help: 'Scheduled posts need a future "Published at" date and only display once that date has passed',
        },
        { name: 'publishedAt', label: 'Published at', type: 'date' },
        { name: 'authorName', label: 'Author name', type: 'text' },
        { name: 'seoTitle', label: 'SEO title', type: 'text' },
        { name: 'seoDescription', label: 'SEO description', type: 'textarea' },
        { name: 'seoKeywords', label: 'SEO keywords', type: 'text' },
        { name: 'canonicalUrl', label: 'Canonical URL', type: 'url' },
        { name: 'ogImage', label: 'Open Graph image URL', type: 'url' },
      ]}
    />
  );
}
