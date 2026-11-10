import { NextRequest, NextResponse } from 'next/server';
import { getTableColumns } from 'drizzle-orm';
import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { resourceTables, isValidResource, buildRecordValues, InvalidFieldError } from '@/lib/admin-resources';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { toErrorResponse } from '@/lib/route-error';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<any> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { resource } = await context.params;
    if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = resourceTables[resource];
    const rows = await db.select().from(table as any);
    return NextResponse.json({ data: rows });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load records.');
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  try {
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

    let values: Record<string, unknown>;
    try {
      values = buildRecordValues(columns as any, body);
    } catch (err) {
      if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
      throw err;
    }

    try {
      const inserted = (await db.insert(table as any).values(values).returning()) as any[];
      return NextResponse.json({ data: inserted[0] }, { status: 201 });
    } catch (err) {
      if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
      throw err;
    }
  } catch (err) {
    return toErrorResponse(err, 'Failed to create record.');
  }
}