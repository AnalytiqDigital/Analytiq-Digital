import { NextResponse } from 'next/server';
import { db } from '@/db';
import { setPortalSessionCookie, verifyPortalPassword } from '@/lib/portal-auth';

const attempts = new Map<string, number[]>();
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 8;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`${ip}:${email}`)) {
      return NextResponse.json({ error: 'Too many login attempts. Try again in a few minutes.' }, { status: 429 });
    }

    const client = await db.query.portalClients.findFirst({
      where: (c, { eq }) => eq(c.email, email),
    });
    if (!client) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    if (client.status === 'disabled') {
      return NextResponse.json({ error: 'This account has been disabled. Please contact us.' }, { status: 403 });
    }

    const valid = await verifyPortalPassword(password, client.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await setPortalSessionCookie({ clientId: client.id, email: client.email, name: client.name });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Portal login error:', err);
    return NextResponse.json({ error: 'Something went wrong signing in. Please try again.' }, { status: 500 });
  }
}
