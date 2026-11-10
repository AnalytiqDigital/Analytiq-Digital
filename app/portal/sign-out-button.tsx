'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function PortalSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/portal/auth/logout', { method: 'POST' });
    router.push('/portal/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-red-50 hover:text-red-700"
    >
      <LogOut size={15} />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}
