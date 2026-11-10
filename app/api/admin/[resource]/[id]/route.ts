// import { NextResponse } from 'next/server';
// import { eq, getTableColumns } from 'drizzle-orm';
// import { db } from '@/db';
// import { getSession } from '@/lib/auth';
// import { resourceTables, isValidResource, PROTECTED_COLUMNS, coerceColumnValue } from '@/lib/admin-resources';
// import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';

// interface RouteParams {
//   params: Promise<{ resource: string; id: string }>;
// }

// export async function GET(_request: Request, { params }: RouteParams) {
//   const session = await getSession();
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//   const { resource, id } = await params;
//   if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

//   const table = resourceTables[resource];
//   const columns = getTableColumns(table as any);
//   const idColumn = (columns as any).id;

//   const rows = await db.select().from(table as any).where(eq(idColumn, Number(id))).limit(1);
//   if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//   return NextResponse.json({ data: rows[0] });
// }

// export async function PUT(request: Request, { params }: RouteParams) {
//   const session = await getSession();
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

//   const { resource, id } = await params;
//   if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

//   const table = resourceTables[resource];
//   const columns = getTableColumns(table as any);
//   const idColumn = (columns as any).id;

//   const body = await request.json().catch(() => null);
//   if (!body || typeof body !== 'object') {
//     return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
//   }

//   const values: Record<string, unknown> = {};
//   for (const key of Object.keys(columns)) {
//     if (PROTECTED_COLUMNS.has(key)) continue;
//     if (key in body) values[key] = coerceColumnValue((columns as any)[key], body[key]);
//   }
//   // Auto-bump updatedAt if the table has that column.
//   if ('updatedAt' in columns) {
//     values.updatedAt = new Date();
//   }

//   try {
//     const updated = (await db
//       .update(table as any)
//       .set(values)
//       .where(eq(idColumn, Number(id)))
//       .returning()) as any[];

//     if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     return NextResponse.json({ data: updated[0] });
//   } catch (err) {
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : 'Failed to update record' },
//       { status: 400 },
//     );
//   }
// }

// export async function DELETE(_request: Request, { params }: RouteParams) {
//   const session = await getSession();
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

//   const { resource, id } = await params;
//   if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

//   const table = resourceTables[resource];
//   const columns = getTableColumns(table as any);
//   const idColumn = (columns as any).id;

//   const deleted = (await db.delete(table as any).where(eq(idColumn, Number(id))).returning()) as any[];
//   if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

//   return NextResponse.json({ data: deleted[0] });
// }



import { NextRequest, NextResponse } from 'next/server';
import { eq, getTableColumns } from 'drizzle-orm';
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

    const { resource, id } = await context.params;
    if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = resourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

    const rows = await db.select().from(table as any).where(eq(idColumn, Number(id))).limit(1);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load record.');
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const { resource, id } = await context.params;
    if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = resourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

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
    if ('updatedAt' in columns) {
      values.updatedAt = new Date();
    }

    try {
      const updated = (await db
        .update(table as any)
        .set(values)
        .where(eq(idColumn, Number(id)))
        .returning()) as any[];

      if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ data: updated[0] });
    } catch (err) {
      if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
      throw err;
    }
  } catch (err) {
    return toErrorResponse(err, 'Failed to update record.');
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<any> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const { resource, id } = await context.params;
    if (!isValidResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = resourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

    const deleted = (await db.delete(table as any).where(eq(idColumn, Number(id))).returning()) as any[];
    if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ data: deleted[0] });
  } catch (err) {
    return toErrorResponse(err, 'Delete failed.');
  }
}