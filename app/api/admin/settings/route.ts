import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { canManageSettings, hasAdminAccess } from '@/lib/permissions';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let settings = await db.query.siteSettings.findFirst();
  if (!settings) {
    const inserted = await db.insert(siteSettings).values({}).returning();
    settings = inserted[0];
  }
  return NextResponse.json({ data: settings });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!canManageSettings(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const existing = await db.query.siteSettings.findFirst();
  const allowedFields = [
    'companyName',
    'tagline',
    'logoUrl',
    'phone',
    'email',
    'address',
    'socialLinks',
    'googlePlaceId',
    'seoDefaultTitle',
    'seoDefaultDescription',
  ];
  const values: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowedFields) {
    if (key in body) values[key] = body[key];
  }

  if (!existing) {
    const inserted = await db.insert(siteSettings).values(values).returning();
    return NextResponse.json({ data: inserted[0] });
  }

  const updated = await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id)).returning();
  return NextResponse.json({ data: updated[0] });
}
