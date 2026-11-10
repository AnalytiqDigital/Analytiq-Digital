'use client';

import PortalResourceManager from '@/components/admin/PortalResourceManager';

export default function AdminPortalClientsPage() {
  return (
    <PortalResourceManager
      resource="clients"
      title="Portal Clients"
      subtitle="Client logins for the portal. Leave the password blank to auto-generate a temporary one (shown once)."
      emptyLabel="No portal clients yet. Add one to give a client access to the portal."
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'company', label: 'Company' },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'name', label: 'Full name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true, help: 'Used for login and Paystack receipts.' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['active', 'invited', 'disabled'],
          help: 'Disabled blocks login immediately.',
        },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'phone', label: 'Phone / WhatsApp', type: 'text' },
        {
          name: 'password',
          label: 'Password',
          type: 'text',
          help: 'Leave blank on create to auto-generate. Leave blank on edit to keep the current password.',
        },
      ]}
      extraNotice={(extra, created) => (
        <p>
          <strong>{String((created as any)?.name || 'Client')} created.</strong>{' '}
          {extra.tempPassword ? (
            <>Temporary password (copy it now — it won&apos;t be shown again): <code className="font-mono font-bold">{String(extra.tempPassword)}</code></>
          ) : (
            <>The password you set is active.</>
          )}
        </p>
      )}
    />
  );
}
