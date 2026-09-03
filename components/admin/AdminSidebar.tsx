'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { adminNavItems } from './adminNavItems';

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Image src="/logo.png" alt="AnalytIQ Digital" width={120} height={80} className="h-9 w-auto object-contain" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminNavItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-brand-gradient text-white' : 'text-ink/70 hover:bg-surface-off hover:text-brand'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <p className="truncate px-3 py-1 text-xs text-ink/50">{userEmail}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
