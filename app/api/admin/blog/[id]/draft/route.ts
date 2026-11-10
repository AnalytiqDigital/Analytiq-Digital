import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import {
  isTipTapDoc,
  renderTipTapDocToHtml,
  tipTapDocToText,
} from '@/lib/blog-render';
import { toErrorResponse } from '@/lib/route-error';

/**
 * Lightweight autosave endpoint. Saves the editor document (+ optional title)
 * without touching publishing fields. Returns the rendered HTML + timestamp
 * so the UI can show "Saved · 12:03" and power the preview tab.
 */
export async function PUT(request: NextRequest, context: { params: Promise<any> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await context.params;
    const postId = Number(id);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!isTipTapDoc(body.contentJson)) {
      return NextResponse.json({ error: 'The article content is not a valid document.' }, { status: 400 });
    }

    const set: Record<string, unknown> = {
      contentJson: body.contentJson,
      contentHtml: renderTipTapDocToHtml(body.contentJson),
      content: tipTapDocToText(body.contentJson),
      updatedAt: new Date(),
    };
    if (typeof body.title === 'string' && body.title.trim()) {
      set.title = body.title.trim().slice(0, 200);
    }

    const updated = (await db
      .update(blogPosts)
      .set(set)
      .where(eq(blogPosts.id, postId))
      .returning({ updatedAt: blogPosts.updatedAt, contentHtml: blogPosts.contentHtml })) as Array<{
      updatedAt: Date;
      contentHtml: string | null;
    }>;
    if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      data: { updatedAt: updated[0].updatedAt, contentHtml: updated[0].contentHtml ?? '' },
    });
  } catch (err) {
    return toErrorResponse(err, 'Autosave failed.');
  }
}
