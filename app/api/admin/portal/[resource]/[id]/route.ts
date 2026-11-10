import { NextRequest, NextResponse } from 'next/server';
import { eq, getTableColumns } from 'drizzle-orm';
import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import {
  isValidPortalResource,
  maybeCreateMilestoneDraftInvoice,
  portalResourceTables,
  preparePortalUpdate,
  recomputeProjectProgress,
  sanitizePortalRow,
} from '@/lib/portal-resources';
import { hashPortalPassword } from '@/lib/portal-auth';
import { InvalidFieldError } from '@/lib/admin-resources';
import { portalProjects } from '@/db/schema-portal';
import { toErrorResponse } from '@/lib/route-error';

interface RouteParams {
  params: Promise<{ resource: string; id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { resource, id } = await params;
    if (!isValidPortalResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = portalResourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

    const rows = await db.select().from(table as any).where(eq(idColumn, Number(id))).limit(1);
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: sanitizePortalRow(resource, rows[0]) });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load record.');
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const { resource, id } = await params;
    if (!isValidPortalResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = portalResourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Capture milestone status before update so completion stubs fire once.
    let milestoneBefore: any = null;
    if (resource === 'milestones') {
      const before = await db.select().from(table as any).where(eq(idColumn, Number(id))).limit(1);
      milestoneBefore = before[0] ?? null;
    }

    try {
      const values = await preparePortalUpdate(resource, body, hashPortalPassword, Number(id));
    const updated = (await db
      .update(table as any)
      .set(values)
      .where(eq(idColumn, Number(id)))
      .returning()) as any[];
    if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let extra: Record<string, unknown> | undefined;
    if (resource === 'milestones') {
      const projectId = updated[0].projectId;
      if (typeof projectId === 'number') await recomputeProjectProgress(projectId);
      const prevStatus = typeof milestoneBefore?.status === 'string' ? milestoneBefore.status : '';
      if (updated[0].status === 'completed' && prevStatus !== 'completed') {
        // Look up the owning project for the client id (milestones carry projectId only).
        const projects = await db.select().from(portalProjects).where(eq(portalProjects.id, updated[0].projectId)).limit(1);
        const clientId = projects[0]?.clientId;
        if (typeof clientId === 'number') {
          const stub = await maybeCreateMilestoneDraftInvoice({
            milestoneId: updated[0].id,
            projectId: updated[0].projectId,
            clientId,
            title: updated[0].title,
            previousStatus: prevStatus,
            newStatus: updated[0].status,
          });
          if (stub.created) extra = { draftInvoiceId: stub.invoiceId };
        }
      }
    }

      return NextResponse.json({ data: sanitizePortalRow(resource, updated[0]), ...(extra ? { extra } : {}) }, { status: 200 });
    } catch (err) {
      if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
      throw err;
    }
  } catch (err) {
    return toErrorResponse(err, 'Failed to update record.');
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const { resource, id } = await params;
    if (!isValidPortalResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = portalResourceTables[resource];
    const columns = getTableColumns(table as any);
    const idColumn = (columns as any).id;

    // Capture projectId before deleting a milestone so progress stays correct.
    let milestoneProjectId: number | null = null;
    if (resource === 'milestones') {
      const rows = await db.select().from(table as any).where(eq(idColumn, Number(id))).limit(1);
      if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      milestoneProjectId = (rows[0] as any).projectId ?? null;
    }

    const deleted = (await db.delete(table as any).where(eq(idColumn, Number(id))).returning()) as any[];
    if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (resource === 'milestones' && milestoneProjectId != null) {
      await recomputeProjectProgress(milestoneProjectId);
    }

    return NextResponse.json({ data: sanitizePortalRow(resource, deleted[0]) });
  } catch (err) {
    return toErrorResponse(err, 'Delete failed.');
  }
}
