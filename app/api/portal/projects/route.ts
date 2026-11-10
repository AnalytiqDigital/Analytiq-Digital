import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { portalMilestones, portalProjects, portalUpdates } from '@/db/schema-portal';
import { getPortalSession } from '@/lib/portal-auth';

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = await db
    .select()
    .from(portalProjects)
    .where(eq(portalProjects.clientId, session.clientId))
    .orderBy(desc(portalProjects.updatedAt));

  const withMilestones = await Promise.all(
    projects.map(async (p) => {
      const milestones = await db
        .select()
        .from(portalMilestones)
        .where(eq(portalMilestones.projectId, p.id));
      const updates = await db
        .select()
        .from(portalUpdates)
        .where(eq(portalUpdates.projectId, p.id))
        .orderBy(desc(portalUpdates.createdAt))
        .limit(10);
      return { ...p, milestones: milestones.sort((a, b) => a.sortOrder - b.sortOrder), updates };
    }),
  );

  return NextResponse.json({ data: withMilestones });
}
