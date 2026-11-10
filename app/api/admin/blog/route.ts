import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { slugify } from '@/lib/seo-ai';
import { emptyTipTapDoc } from '@/lib/blog-render';
import { toErrorResponse } from '@/lib/route-error';

const LIST_COLUMNS = {
  id: blogPosts.id,
  slug: blogPosts.slug,
  title: blogPosts.title,
  status: blogPosts.status,
  category: blogPosts.category,
  publishedAt: blogPosts.publishedAt,
  updatedAt: blogPosts.updatedAt,
} as const;

async function uniqueSlug(base: string): Promise<string> {
  const clean = slugify(base) || 'untitled';
  let candidate = clean;
  let n = 2;
  for (;;) {
    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, candidate),
      columns: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${clean}-${n++}`;
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const rows = await db
      .select(LIST_COLUMNS)
      .from(blogPosts)
      .orderBy(desc(blogPosts.updatedAt));
    return NextResponse.json({ data: rows });
  } catch (err) {
    return toErrorResponse(err, 'Failed to load posts.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasAdminAccess(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!requireWriteAccess(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'Untitled post';
    const slug = await uniqueSlug(title);
    const doc = emptyTipTapDoc();

    const inserted = (await db
      .insert(blogPosts)
      .values({
        slug,
        title,
        excerpt: '',
        content: '',
        contentJson: doc,
        contentHtml: '',
        category: '',
        tags: [],
        status: 'draft',
        publishedAt: null,
        authorName: session.name || '',
      })
      .returning()) as any[];

    return NextResponse.json({ data: inserted[0] }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err, 'Could not create post.');
  }
}
