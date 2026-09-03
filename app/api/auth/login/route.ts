import { NextResponse } from 'next/server';
import { db } from '@/db';
import { setSessionCookie, verifyPassword } from '@/lib/auth';

// Simple in-memory rate limiting per IP+email for login attempts. Resets on
// cold start; for production, back this with a durable store (e.g. Upstash
// Redis) since serverless instances don't share memory.
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

    const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, email) });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await setSessionCookie({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Surface configuration problems as a clear, actionable message
    // instead of letting them crash into an unhandled 500 that the login
    // form can't explain. These are the two most common causes of "login
    // just doesn't work" with no visible error:
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    const isAuthSecretError = message.includes('AUTH_SECRET');
    const isMissingTableError = /no such table/i.test(message);

    console.error('Login route error:', err);

    let hint = 'Something went wrong signing in. Please try again.';
    if (isAuthSecretError) {
      hint = `Server misconfiguration: ${message} Set AUTH_SECRET in your .env.local (see .env.example) and restart the dev server.`;
    } else if (isMissingTableError) {
      hint = 'Database not initialized: run "npm run db:push" then "npm run db:seed", then restart the dev server.';
    }

    return NextResponse.json(
      {
        error: hint,
      },
      { status: 500 },
    );
  }
}
