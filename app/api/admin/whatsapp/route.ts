import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { waContacts, waMessages } from '@/db/schema-whatsapp';
import { sendWhatsAppText } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// List contacts (with their latest message) or one contact's conversation.
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const contactId = request.nextUrl.searchParams.get('contact');

  if (contactId) {
    const messages = await db
      .select()
      .from(waMessages)
      .where(eq(waMessages.contactId, Number(contactId)))
      .orderBy(waMessages.createdAt)
      .limit(200);
    return NextResponse.json({ messages });
  }

  const contacts = await db.select().from(waContacts).orderBy(desc(waContacts.lastMessageAt)).limit(100);
  return NextResponse.json({ contacts });
}

// Manual reply from the team, or pause/resume the AI for a contact.
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { contactId?: number; action?: string; message?: string; aiPaused?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const contactId = Number(body.contactId);
  if (!contactId) return NextResponse.json({ error: 'contactId is required' }, { status: 400 });

  const contact = (await db.select().from(waContacts).where(eq(waContacts.id, contactId)).limit(1))[0];
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

  if (body.action === 'toggle-ai') {
    await db
      .update(waContacts)
      .set({ aiPaused: Boolean(body.aiPaused), updatedAt: new Date() })
      .where(eq(waContacts.id, contactId));
    return NextResponse.json({ ok: true, aiPaused: Boolean(body.aiPaused) });
  }

  if (body.action === 'send') {
    const text = (body.message ?? '').trim().slice(0, 4000);
    if (!text) return NextResponse.json({ error: 'message is required' }, { status: 400 });
    try {
      const { messageId } = await sendWhatsAppText(contact.phone, text);
      await db.insert(waMessages).values({
        contactId,
        waMessageId: messageId,
        direction: 'out',
        body: text,
        status: 'accepted',
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
