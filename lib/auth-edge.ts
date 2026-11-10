import { jwtVerify } from 'jose';

export interface SessionPayload {
  userId: number;
  email: string;
  role: string;
  /** Admin display name. Absent on tokens issued before this field existed. */
  name?: string;
}

export const SESSION_COOKIE = 'aq_session';

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'AUTH_SECRET is not set (or too short). Set a long random string in your environment before using admin auth.',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== 'number' || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      ...(typeof payload.name === 'string' ? { name: payload.name } : {}),
    };
  } catch {
    return null;
  }
}
