import { NextRequest, NextResponse, after } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { waContacts, waMessages, waWebhookEvents, waAgentReplies } from '@/db/schema-whatsapp';
import { extractEmail, generateAgentReply, loadKnowledgeBase, shouldAskForEmail, type ChatTurn } from '@/lib/ai-agent';
import { nextStatus, sendWhatsAppText } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Meta webhook verification handshake.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

interface WaInboundMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body?: string };
}

interface WaStatusCallback {
  id: string;
  status: string;
  recipient_id?: string;
}

interface WaChangeValue {
  contacts?: { profile?: { name?: string }; wa_id?: string }[];
  messages?: WaInboundMessage[];
  statuses?: WaStatusCallback[];
}

export async function POST(request: NextRequest) {
  let body: { entry?: { changes?: { field?: string; value?: WaChangeValue }[] }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const replyJobs: { messageId: number; contactId: number; phone: string; text: string }[] = [];

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;

      // Delivery status callbacks — forward-only updates on outbound messages.
      for (const status of value.statuses ?? []) {
        try {
          await db
            .insert(waWebhookEvents)
            .values({ eventKey: `${status.id}:${status.status}`, eventType: 'status', payload: status })
            .onConflictDoNothing();
          const rows = await db
            .select({ id: waMessages.id, status: waMessages.status })
            .from(waMessages)
            .where(eq(waMessages.waMessageId, status.id))
            .limit(1);
          if (rows[0]) {
            const updated = nextStatus(rows[0].status, status.status);
            if (updated !== rows[0].status) {
              await db.update(waMessages).set({ status: updated }).where(eq(waMessages.id, rows[0].id));
            }
          }
        } catch (err) {
          console.error('Status callback failed:', err);
        }
      }

      // Inbound customer messages.
      for (const message of value.messages ?? []) {
        if (message.type !== 'text' || !message.text?.body) continue;
        const text = message.text.body.slice(0, 4000);
        const profileName =
          value.contacts?.find((c) => c.wa_id === message.from)?.profile?.name?.slice(0, 200) ?? '';

        try {
          await db
            .insert(waWebhookEvents)
            .values({ eventKey: message.id, eventType: 'message', payload: message })
            .onConflictDoNothing();

          // Upsert the contact; capture a typed email address when present.
          const typedEmail = extractEmail(text);
          const existing = await db
            .select()
            .from(waContacts)
            .where(eq(waContacts.phone, message.from))
            .limit(1);
          let contact = existing[0];
          if (!contact) {
            const inserted = await db
              .insert(waContacts)
              .values({
                phone: message.from,
                name: profileName,
                email: typedEmail,
                lastMessageAt: new Date(),
              })
              .onConflictDoNothing()
              .returning();
            contact =
              inserted[0] ??
              (await db.select().from(waContacts).where(eq(waContacts.phone, message.from)).limit(1))[0];
          } else {
            await db
              .update(waContacts)
              .set({
                lastMessageAt: new Date(),
                updatedAt: new Date(),
                ...(profileName && !contact.name ? { name: profileName } : {}),
                ...(typedEmail ? { email: typedEmail } : {}),
              })
              .where(eq(waContacts.id, contact.id));
            contact = { ...contact, email: typedEmail ?? contact.email };
          }
          if (!contact) continue;

          // Store the message once (webhook retries carry the same id).
          const stored = await db
            .insert(waMessages)
            .values({
              contactId: contact.id,
              waMessageId: message.id,
              direction: 'in',
              body: text,
              status: 'received',
            })
            .onConflictDoNothing()
            .returning();
          const inbound = stored[0];
          if (!inbound) continue; // duplicate delivery — already handled

          if (!contact.aiPaused) {
            replyJobs.push({ messageId: inbound.id, contactId: contact.id, phone: contact.phone, text });
          }
        } catch (err) {
          console.error('Inbound message handling failed:', err);
        }
      }
    }
  }

  // Acknowledge Meta immediately, then reply in the background so a slow AI
  // call can never cause webhook retries.
  after(async () => {
    for (const job of replyJobs) {
      await processAgentReply(job);
    }
  });

  return NextResponse.json({ ok: true });
}

async function processAgentReply(job: { messageId: number; contactId: number; phone: string; text: string }) {
  // One reply attempt per inbound message — never resend on retry.
  const claimed = await db
    .insert(waAgentReplies)
    .values({ inboundMessageId: job.messageId, status: 'pending' })
    .onConflictDoNothing()
    .returning();
  if (!claimed[0]) return;

  try {
    const recent = await db
      .select({ direction: waMessages.direction, body: waMessages.body })
      .from(waMessages)
      .where(eq(waMessages.contactId, job.contactId))
      .orderBy(waMessages.createdAt)
      .limit(20);
    const history: ChatTurn[] = recent.slice(0, -1).map((m) => ({
      role: m.direction === 'in' ? 'user' : 'assistant',
      content: m.body,
    }));
    const inboundCount = recent.filter((m) => m.direction === 'in').length;
    const contact = (await db.select().from(waContacts).where(eq(waContacts.id, job.contactId)).limit(1))[0];

    const knowledge = await loadKnowledgeBase();
    const reply = await generateAgentReply({
      message: job.text,
      history,
      knowledge,
      askForEmail: shouldAskForEmail(inboundCount, Boolean(contact?.email)),
    });

    const { messageId: waId } = await sendWhatsAppText(job.phone, reply);

    await db.insert(waMessages).values({
      contactId: job.contactId,
      waMessageId: waId,
      direction: 'out',
      body: reply,
      status: 'accepted',
    });
    await db
      .update(waAgentReplies)
      .set({ replyText: reply, status: 'sent', updatedAt: new Date() })
      .where(eq(waAgentReplies.id, claimed[0].id));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Agent reply failed:', message);
    await db
      .update(waAgentReplies)
      .set({ status: 'failed', error: message.slice(0, 1000), updatedAt: new Date() })
      .where(eq(waAgentReplies.id, claimed[0].id));
  }
}
