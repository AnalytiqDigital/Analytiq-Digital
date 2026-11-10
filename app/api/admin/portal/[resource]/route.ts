import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { eq } from 'drizzle-orm';
import {
  finalizeInvoiceNumber,
  isValidPortalResource,
  maybeCreateMilestoneDraftInvoice,
  portalResourceTables,
  preparePortalCreate,
  recomputeProjectProgress,
  sanitizePortalRow,
} from '@/lib/portal-resources';
import { portalProjects } from '@/db/schema-portal';
import { hashPortalPassword } from '@/lib/portal-auth';
import { InvalidFieldError } from '@/lib/admin-resources';
import { toErrorResponse } from '@/lib/route-error';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { resource } = await context.params;
    if (!isValidPortalResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = portalResourceTables[resource];
    const rows = await db.select().from(table as any);
    return NextResponse.json({ data: rows.map((r: any) => sanitizePortalRow(resource, r)) });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load records.');
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const { resource } = await context.params;
    if (!isValidPortalResource(resource)) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });

    const table = portalResourceTables[resource];
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
      const prepared = await preparePortalCreate(resource, body, hashPortalPassword);
      const inserted = (await db.insert(table as any).values(prepared.values).returning()) as any[];
      const row = inserted[0];

      let extra: Record<string, unknown> | undefined = prepared.extra;
      if (resource === 'invoices') {
        const final = await finalizeInvoiceNumber(row.id, row.invoiceNumber);
        if (final) {
          row.invoiceNumber = final;
          extra = { ...(extra || {}), invoiceNumber: final };
        }
      }
      if (resource === 'milestones') {
        if (typeof row.projectId === 'number') await recomputeProjectProgress(row.projectId);
        if (row.status === 'completed') {
          const projects = await db.select().from(portalProjects).where(eq(portalProjects.id, row.projectId)).limit(1);
          const clientId = projects[0]?.clientId;
          if (typeof clientId === 'number') {
            const stub = await maybeCreateMilestoneDraftInvoice({
              milestoneId: row.id,
              projectId: row.projectId,
              clientId,
              title: row.title,
              previousStatus: 'pending',
              newStatus: 'completed',
            });
            if (stub.created) extra = { ...(extra || {}), draftInvoiceId: stub.invoiceId };
          }
        }
      }

      const clean = sanitizePortalRow(resource, row);
      return NextResponse.json({ data: clean, ...(extra ? { extra } : {}) }, { status: 201 });
    } catch (err) {
      if (err instanceof InvalidFieldError) return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
      throw err;
    }
  } catch (err) {
    return toErrorResponse(err, 'Failed to create record.');
  }
}
