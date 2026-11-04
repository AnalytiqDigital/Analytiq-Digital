'use server';

import { Resend } from 'resend';
import { siteConfig } from '@/lib/site-config';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ConsultationFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Prefilled wa.me link so the visitor can continue the conversation on WhatsApp. */
  whatsappUrl?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 500;
const MAX_MESSAGE = 2000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function submitConsultationForm(
  _prevState: ConsultationFormState,
  formData: FormData,
): Promise<ConsultationFormState> {
  // Honeypot — real users never fill this in; bots often do.
  const honeypot = String(formData.get('company_website') || '');
  if (honeypot.trim().length > 0) {
    return { status: 'success', message: "Thanks — we'll get back to you shortly." };
  }

  const name = String(formData.get('name') || '').trim().slice(0, MAX_FIELD);
  const email = String(formData.get('email') || '').trim().slice(0, MAX_FIELD);
  const phone = String(formData.get('phone') || '').trim().slice(0, MAX_FIELD);
  const company = String(formData.get('company') || '').trim().slice(0, MAX_FIELD);
  const topic = String(formData.get('topic') || '').trim().slice(0, MAX_FIELD);
  const preferredTime = String(formData.get('preferredTime') || '').trim().slice(0, MAX_FIELD);
  const message = String(formData.get('message') || '').trim().slice(0, MAX_MESSAGE);

  if (!name || !email || !message) {
    return {
      status: 'error',
      message: 'Please fill in your name, email, and a short description of what you need.',
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  const summaryLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Company: ${company || 'Not provided'}`,
    `Topic: ${topic || 'Not specified'}`,
    `Preferred time: ${preferredTime || 'Flexible'}`,
    '',
    message,
  ];
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hi AnalytIQ Digital, I just booked a consultation on your website.\n\n${summaryLines.join('\n')}`,
  )}`;

  try {
    const receivingEmail = process.env.CONTACT_RECEIVING_EMAIL || siteConfig.email;
    const { error } = await resend.emails.send({
      // Until the domain is verified in Resend, use onboarding@resend.dev to test immediately
      from: 'AnalytIQ Consultations <onboarding@resend.dev>',
      to: [receivingEmail],
      replyTo: email,
      subject: `Consultation Request: ${escapeHtml(name)} (${escapeHtml(topic || 'General')})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Consultation Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${escapeHtml(phone || 'Not provided')}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${escapeHtml(company || 'Not provided')}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Topic:</td><td>${escapeHtml(topic || 'Not specified')}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Preferred time:</td><td>${escapeHtml(preferredTime || 'Flexible')}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3 style="margin-bottom: 6px; color: #0f172a;">What they need:</h3>
          <p style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          <p style="margin-top: 16px; font-size: 13px; color: #64748b;">
            Reply by email, or continue on WhatsApp:
            <a href="${whatsappUrl}">open a prefilled WhatsApp chat with this visitor's details</a>.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return { status: 'error', message: `Delivery failed: ${error.message}` };
    }

    return {
      status: 'success',
      message:
        "Thanks — your consultation request is in. We'll reply within one business day. Want a faster answer? Continue on WhatsApp below.",
      whatsappUrl,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Consultation submission error:', error);
    return { status: 'error', message: 'Failed to deliver your request. Please try WhatsApp instead.' };
  }
}
