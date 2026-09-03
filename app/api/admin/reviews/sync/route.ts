import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { getGoogleReviews } from '@/lib/google-reviews';

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await getGoogleReviews();

  if (!result.configured) {
    return NextResponse.json(
      { error: 'Google Reviews is not configured. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID first.' },
      { status: 400 },
    );
  }
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  let synced = 0;
  for (const review of result.reviews) {
    const externalId = `google:${review.authorName}:${review.time}`;
    const existing = await db.query.reviews.findFirst({ where: (r, { eq }) => eq(r.externalId, externalId) });
    if (existing) continue;

    await db.insert(reviews).values({
      source: 'google',
      externalId,
      authorName: review.authorName,
      authorPhoto: review.authorPhotoUrl,
      rating: review.rating,
      text: review.text,
      reviewTime: new Date(review.time * 1000),
    });
    synced += 1;
  }

  return NextResponse.json({ synced, rating: result.rating, totalReviews: result.totalReviews });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(reviews);
  return NextResponse.json({ data: rows });
}
