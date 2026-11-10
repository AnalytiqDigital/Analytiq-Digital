import Link from 'next/link';
import Image from 'next/image';
import { getPortalSession } from '@/lib/portal-auth';
import PortalSignOutButton from './sign-out-button';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getPortalSession();

  // Login/signup render without chrome; proxy handles redirects for the rest.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-off">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/portal" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AnalytIQ Digital" width={120} height={80} className="h-8 w-auto object-contain" />
            <span className="hidden rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand sm:inline">
              Client Portal
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
            <Link href="/portal" className="rounded-lg px-3 py-2 text-ink/70 hover:bg-surface-off hover:text-brand">
              Overview
            </Link>
            <Link href="/portal/projects" className="rounded-lg px-3 py-2 text-ink/70 hover:bg-surface-off hover:text-brand">
              Projects
            </Link>
            <Link href="/portal/invoices" className="rounded-lg px-3 py-2 text-ink/70 hover:bg-surface-off hover:text-brand">
              Invoices
            </Link>
            <Link href="/portal/renewals" className="rounded-lg px-3 py-2 text-ink/70 hover:bg-surface-off hover:text-brand">
              Renewals
            </Link>
            <span className="hidden px-2 text-xs text-ink/50 md:inline">{session.email}</span>
            <PortalSignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
