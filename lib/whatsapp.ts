// Meta WhatsApp Cloud API helpers (server-only).

const GRAPH_VERSION = 'v21.0';

export type WaStatus = 'received' | 'accepted' | 'sent' | 'delivered' | 'read' | 'failed';

const STATUS_ORDER: Record<WaStatus, number> = {
  received: 0,
  accepted: 1,
  sent: 2,
  delivered: 3,
  read: 4,
  failed: 5,
};

/**
 * Delivery statuses only move forward. An older "sent" callback must never
 * overwrite a later "delivered"/"read". "failed" always wins.
 */
export function nextStatus(current: string, incoming: string): string {
  if (incoming === 'failed') return 'failed';
  const cur = STATUS_ORDER[current as WaStatus] ?? 0;
  const inc = STATUS_ORDER[incoming as WaStatus] ?? 0;
  return inc > cur ? incoming : current;
}

/** Normalize a WhatsApp number to digits only (E.164 without the leading +). */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

export async function sendWhatsAppText(to: string, body: string): Promise<{ messageId: string | null }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured');
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizePhone(to),
      type: 'text',
      text: { body: body.slice(0, 4000) },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WhatsApp send failed (${res.status}): ${text}`);
  }

  try {
    const parsed = JSON.parse(text) as { messages?: { id?: string }[] };
    return { messageId: parsed.messages?.[0]?.id ?? null };
  } catch {
    return { messageId: null };
  }
}
