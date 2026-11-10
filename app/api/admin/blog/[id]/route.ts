import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ne } from 'drizzle-orm';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { parseDateValue } from '@/lib/admin-resources';
import { slugify } from '@/lib/seo-ai';
import { toErrorResponse } from '@/lib/route-error';
import {
  isTipTapDoc,
  renderTipTapDocToHtml,
  tipTapDocToText,
} from '@/lib/blog-render';

const STATUSES = new Set(['draft', 'scheduled', 'published']);

function cleanString(v: unknown, max = 10_000): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

function cleanTags(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean).slice(0, 20);
  }
  if (typeof v === 'string') {
    return v.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 20);
  }
  return [];
}

async function getPost(id: number) {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function GET(_request: NextRequest, context: { params: Promise<any> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await context.params;
    const post = await getPost(Number(id));
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: post });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load post.');
  }
}

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
    const existing = await getPost(postId);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const title = cleanString(body.title, 200);
    if (!title) return NextResponse.json({ error: 'A title is required.' }, { status: 400 });

    const rawSlug = cleanString(body.slug, 120);
    if (!rawSlug) return NextResponse.json({ error: 'A URL slug is required.' }, { status: 400 });
    const slug = slugify(rawSlug);
    if (!slug) return NextResponse.json({ error: 'That slug has no usable characters — use letters, numbers and hyphens.' }, { status: 400 });

    const clash = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.slug, slug), ne(blogPosts.id, postId)),
      columns: { id: true },
    });
    if (clash) return NextResponse.json({ error: 'That URL slug is already used by another post.' }, { status: 409 });

    const status = typeof body.status === 'string' ? body.status : 'draft';
    if (!STATUSES.has(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });

    let publishedAt: Date | null = null;
    if (body.publishedAt) {
      publishedAt = parseDateValue(body.publishedAt);
      if (!publishedAt) return NextResponse.json({ error: '"Published at" must be a valid date.' }, { status: 400 });
    }

    // Rich content: validate the TipTap doc, render the public HTML cache,
    // and backfill the legacy text column so old fallbacks still show copy.
    let contentJson = existing.contentJson;
    let contentHtml = existing.contentHtml;
    let legacyContent = existing.content;
    if (body.contentJson !== undefined) {
      if (!isTipTapDoc(body.contentJson)) {
        return NextResponse.json({ error: 'The article content is not a valid document.' }, { status: 400 });
      }
      contentJson = body.contentJson;
      contentHtml = renderTipTapDocToHtml(body.contentJson);
      legacyContent = tipTapDocToText(body.contentJson);
    }

    const excerpt = cleanString(body.excerpt, 500) ?? '';

    const updated = (await db
      .update(blogPosts)
      .set({
        slug,
        title,
        excerpt,
        content: legacyContent,
        contentJson,
        contentHtml,
        featuredImage: cleanString(body.featuredImage, 2000),
        category: cleanString(body.category, 120) ?? '',
        tags: cleanTags(body.tags),
        status,
        publishedAt,
        authorName: cleanString(body.authorName, 200) ?? '',
        seoTitle: cleanString(body.seoTitle, 200),
        seoDescription: cleanString(body.seoDescription, 500),
        seoKeywords: cleanString(body.seoKeywords, 500),
        canonicalUrl: cleanString(body.canonicalUrl, 2000),
        ogImage: cleanString(body.ogImage, 2000),
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, postId))
      .returning()) as any[];

    return NextResponse.json({ data: updated[0] });
  } catch (err) {
    return toErrorResponse(err, 'Save failed.');
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<any> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await context.params;
    const deleted = (await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, Number(id)))
      .returning()) as any[];
    if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: deleted[0] });
  } catch (err) {
    return toErrorResponse(err, 'Delete failed.');
  }
}
