'use client';

import ResourceManager from '@/components/admin/ResourceManager';

export default function AdminTestimonialsPage() {
  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      emptyLabel="No testimonials yet. Add one here only once it has been manually verified with the client."
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'company', label: 'Company' },
        { key: 'rating', label: 'Rating' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'name', label: 'Customer name', type: 'text', required: true },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'content', label: 'Testimonial', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
        { name: 'photoUrl', label: 'Photo URL', type: 'url' },
        { name: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'], required: true },
      ]}
    />
  );
}
