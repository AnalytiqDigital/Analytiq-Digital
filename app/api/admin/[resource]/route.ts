import { NextRequest, NextResponse } from 'next/server';
import { getTableColumns } from 'drizzle-orm';
import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { resourceTables, isValidResource, PROTECTED_COLUMNS } from '@/lib/admin-resources';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<any> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { resource } = await context.params;
  if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  const table = resourceTables[resource];
  const rows = await db.select().from(table as any);
  return NextResponse.json({ data: rows });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

  const { resource } = await context.params;
  if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

  const table = resourceTables[resource];
  const columns = getTableColumns(table as any);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Only accept keys that are real columns on this table, and never allow
  // the client to set server-managed columns directly.
  const values: Record<string, unknown> = {};
  for (const key of Object.keys(columns)) {
    if (PROTECTED_COLUMNS.has(key)) continue;
    if (key in body) values[key] = body[key];
  }

  try {
    const inserted = (await db.insert(table as any).values(values).returning()) as any[];
    return NextResponse.json({ data: inserted[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create record' },
      { status: 400 },
    );
  }
}