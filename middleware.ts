import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Canonical host for this site. Update if the domain ever changes.
const CANONICAL_HOST = 'www.analytiq.ng';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto');

  let needsRedirect = false;

  // Force HTTPS (Vercel terminates TLS and sets x-forwarded-proto; this is a
  // no-op in local dev where the header is absent).
  if (proto === 'http') {
    url.protocol = 'https:';
    needsRedirect = true;
  }

  // Force apex -> www canonical host. Most registrars/DNS providers can also
  // do this at the DNS/edge level — this is a safety net at the app layer.
  const bareHost = host.split(':')[0];
  if (bareHost === 'analytiq.ng') {
    url.host = CANONICAL_HOST;
    needsRedirect = true;
  }

  if (needsRedirect) {
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
