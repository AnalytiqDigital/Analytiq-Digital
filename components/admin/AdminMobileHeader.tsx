'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { adminNavItems } from './adminNavItems';

export default function AdminMobileHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
      <Image src="/logo.png" alt="AnalytIQ Digital" width={100} height={67} className="h-8 w-auto object-contain" />
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-ink">
          Menu
        </summary>
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-soft">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-surface-off hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </details>
    </div>
  );
}
