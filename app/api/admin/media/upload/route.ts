import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { media } from '@/db/schema';
import { getSession } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

  try {
    const items = await db.select().from(media).orderBy(media.createdAt);
    return NextResponse.json({ data: items }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return NextResponse.json({ error: 'Failed to load media library' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers: corsHeaders });
    }

    const title = String(formData.get('title') || file.name || 'upload');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');

    // Upload straight to Vercel Blob instead of local disk — this is what
    // makes uploads survive on a serverless platform. `addRandomSuffix`
    // avoids collisions if two files share the same name.
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    const saved = await db
      .insert(media)
      .values({
        filename: safeName,
        url: blob.url,
        title,
        altText: title,
      })
      .returning();

    revalidatePath('/admin');
    revalidatePath('/admin/media');

    return NextResponse.json({ data: saved[0], url: blob.url, filename: safeName }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed completely' }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function OPTIONS() {
  return NextResponse.json({ status: 'ok' }, { status: 200, headers: corsHeaders });
}