import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import {
  PORTAL_SESSION_COOKIE,
  verifyPortalSessionToken,
  type PortalSessionPayload,
} from './portal-auth-edge';

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days — clients log in rarely

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'AUTH_SECRET is not set (or too short). Set a long random string in your environment before using portal auth.',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createPortalSessionToken(payload: PortalSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function setPortalSessionCookie(payload: PortalSessionPayload) {
  const token = await createPortalSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearPortalSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PORTAL_SESSION_COOKIE);
}

export async function getPortalSession(): Promise<PortalSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyPortalSessionToken(token);
}

export async function hashPortalPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPortalPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export { PORTAL_SESSION_COOKIE, verifyPortalSessionToken };
export type { PortalSessionPayload };
