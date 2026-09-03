import { NextResponse } from 'next/server';
import { getGoogleReviews } from '@/lib/google-reviews';

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const result = await getGoogleReviews();
  return NextResponse.json(result);
}
