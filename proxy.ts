import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth-edge';

// Canonical host for this site. Update if the domain ever changes.
const CANONICAL_HOST = 'www.analytiq.ng';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto');
  const { pathname } = request.nextUrl;
  const bareHost = host.split(':')[0];

  let needsRedirect = false;

  // Only force HTTPS in production, and never on local development hosts
  const isLocalhost = bareHost === 'localhost' || bareHost === '127.0.0.1';
  if (process.env.NODE_ENV === 'production' && !isLocalhost && proto === 'http') {
    url.protocol = 'https:';
    needsRedirect = true;
  }

  // Force apex -> www canonical host in production
  if (bareHost === 'analytiq.ng') {
    url.host = CANONICAL_HOST;
    needsRedirect = true;
  }

  if (needsRedirect) {
    return NextResponse.redirect(url, 308);
  }

  // Protect the admin dashboard and its API routes.
  const isAdminPath = pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminApiPath = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApiPath) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};