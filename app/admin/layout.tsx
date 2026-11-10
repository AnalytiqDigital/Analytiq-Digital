import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileHeader from '@/components/admin/AdminMobileHeader';

// The dashboard is per-request (session cookie + live DB counts), so it must
// never be statically prerendered during `next build`.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page itself renders through this layout too (it's under
  // /admin/login), so when there's no session we render children (the
  // login form) without any dashboard chrome. Middleware handles the actual
  // redirect for every other /admin path; this is a server-side safety net.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-off">
      <AdminMobileHeader />
      <div className="flex">
        <AdminSidebar userEmail={session.email} />
        <div className="flex-1 lg:pl-64">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
