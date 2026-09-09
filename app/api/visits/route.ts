import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { visitorEvents } from '@/db/schema';
import { formatVisitNotification } from '@/lib/lead-automation';

function pickSourceFromReferrer(referrer: string | null) {
  if (!referrer) return 'direct';

  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, '');
    if (host.includes('google')) return 'google';
    if (host.includes('linkedin')) return 'linkedin';
    if (host.includes('facebook')) return 'facebook';
    if (host.includes('instagram')) return 'instagram';
    return host;
  } catch {
    return 'referral';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = typeof body?.page === 'string' ? body.page : '/';
    const referrer = typeof body?.referrer === 'string' ? body.referrer : null;
    const source = typeof body?.source === 'string' ? body.source : pickSourceFromReferrer(referrer);
    const campaign = typeof body?.campaign === 'string' ? body.campaign : null;
    const userAgent = typeof body?.userAgent === 'string' ? body.userAgent : null;
    const ipAddress = typeof body?.ipAddress === 'string' ? body.ipAddress : null;

    const [event] = await db.insert(visitorEvents).values({
      page,
      referrer,
      source,
      campaign,
      userAgent,
      ipAddress,
    }).returning();

    const message = formatVisitNotification({
      page,
      referrer,
      source,
      campaign,
      userAgent,
      ipAddress,
    });

    if (process.env.SLACK_WEBHOOK_URL || process.env.TELEGRAM_BOT_TOKEN) {
      console.log('[visitor] ' + message);
    }

    return NextResponse.json({ ok: true, data: event ?? null }, { status: 201 });
  } catch (error) {
    console.error('Failed to record visit:', error);
    return NextResponse.json({ error: 'Unable to record visit' }, { status: 500 });
  }
}

export async function GET() {
  const rows = await db.select().from(visitorEvents).orderBy(desc(visitorEvents.createdAt));
  return NextResponse.json({ data: rows });
}
