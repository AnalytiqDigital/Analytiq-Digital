import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portalClients } from '@/db/schema-portal';
import { hashPortalPassword, setPortalSessionCookie } from '@/lib/portal-auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiting per IP (resets on cold start; same caveat as
// the admin login route — back with a durable store for production scale).
const attempts = new Map<string, number[]>();
const WINDOW_MS = 60 * 60_000;
const MAX_ATTEMPTS = 10;

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
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const company = String(body?.company || '').trim();
    const phone = String(body?.phone || '').trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }
    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(`${ip}:portal-signup`)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const existing = await db.query.portalClients.findFirst({
      where: (c, { eq }) => eq(c.email, email),
    });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in instead.' },
        { status: 409 },
      );
    }

    const passwordHash = await hashPortalPassword(password);
    const inserted = await db
      .insert(portalClients)
      .values({
        name,
        email,
        passwordHash,
        company: company || null,
        phone: phone || null,
        status: 'active',
      })
      .returning();

    const client = inserted[0];
    await setPortalSessionCookie({ clientId: client.id, email: client.email, name: client.name });

    return NextResponse.json({ ok: true, clientId: client.id }, { status: 201 });
  } catch (err) {
    console.error('Portal signup error:', err);
    return NextResponse.json({ error: 'Something went wrong creating your account. Please try again.' }, { status: 500 });
  }
}
