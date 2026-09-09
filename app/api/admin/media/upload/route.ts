import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, safeName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${safeName}`;
    const saved = await db
      .insert(media)
      .values({
        filename: safeName,
        url,
        title,
        altText: title,
      })
      .returning();

    revalidatePath('/admin');
    revalidatePath('/admin/media');

    return NextResponse.json({ data: saved[0], url, filename: safeName }, { status: 200, headers: corsHeaders });
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


