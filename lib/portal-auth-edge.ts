import { jwtVerify } from 'jose';

// Client portal sessions live in their own cookie so a client login can never
// be mistaken for an admin session (and vice versa). Edge-safe: no Node APIs.
export interface PortalSessionPayload {
  clientId: number;
  email: string;
  name: string;
}

export const PORTAL_SESSION_COOKIE = 'aq_portal';

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'AUTH_SECRET is not set (or too short). Set a long random string in your environment before using portal auth.',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifyPortalSessionToken(token: string): Promise<PortalSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.clientId !== 'number' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }
    return { clientId: payload.clientId, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}
