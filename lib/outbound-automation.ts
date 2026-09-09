import { buildFollowUpMessage, buildWhatsAppFollowUpMessage } from './lead-automation';

export interface OutboundLead {
  name?: string;
  email?: string | null;
  phone?: string | null;
  serviceInterest?: string | null;
  page?: string | null;
  source?: string | null;
}

export function buildOutboundPlan(lead: OutboundLead) {
  return {
    email: buildFollowUpMessage({
      name: lead.name,
      serviceInterest: lead.serviceInterest,
      page: lead.page || '/services',
      email: lead.email,
    }),
    whatsapp: buildWhatsAppFollowUpMessage({
      name: lead.name,
      serviceInterest: lead.serviceInterest,
      page: lead.page || '/services',
      email: lead.email,
    }),
    source: lead.source || 'direct',
  };
}

export async function notifyWhatsAppLead(lead: OutboundLead) {
  if (!process.env.WHATSAPP_WEBHOOK_URL && !process.env.TWILIO_ACCOUNT_SID) {
    return {
      ok: false,
      reason: 'No WhatsApp or Twilio provider configured',
    };
  }

  const payload = buildOutboundPlan(lead);
  return {
    ok: true,
    message: payload.whatsapp,
  };
}

export async function sendLeadNurtureEmail(lead: OutboundLead) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_RECEIVING_EMAIL) {
    return {
      ok: false,
      reason: 'No email provider configured',
    };
  }

  const payload = buildOutboundPlan(lead);
  return {
    ok: true,
    message: payload.email,
  };
}
