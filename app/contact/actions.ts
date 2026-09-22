// 'use server';

// import { db } from '@/db';
// import { leads } from '@/db/schema';

// export interface ContactFormState {
//   status: 'idle' | 'success' | 'error';
//   message?: string;
// }

// // Extremely simple in-memory rate limiting stub. In production, replace this
// // with a durable store (e.g. Upstash Redis) since this resets on every
// // server restart / cold start and is not shared across instances.
// const submissionLog = new Map<string, number[]>();
// const RATE_LIMIT_WINDOW_MS = 60_000;
// const RATE_LIMIT_MAX = 3;

// function isRateLimited(key: string): boolean {
//   const now = Date.now();
//   const timestamps = (submissionLog.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
//   timestamps.push(now);
//   submissionLog.set(key, timestamps);
//   return timestamps.length > RATE_LIMIT_MAX;
// }

// export async function submitContactForm(
//   _prevState: ContactFormState,
//   formData: FormData,
// ): Promise<ContactFormState> {
//   // Honeypot field — real users never fill this in; bots often do.
//   const honeypot = String(formData.get('company_website') || '');
//   if (honeypot.trim().length > 0) {
//     // Silently "succeed" so bots don't learn the honeypot was detected.
//     return { status: 'success' };
//   }

//   const name = String(formData.get('name') || '').trim();
//   const email = String(formData.get('email') || '').trim();
//   const phone = String(formData.get('phone') || '').trim();
//   const company = String(formData.get('company') || '').trim();
//   const service = String(formData.get('service') || '').trim();
//   const message = String(formData.get('message') || '').trim();
//   const budget = String(formData.get('budget') || '').trim();

//   if (!name || !email || !message) {
//     return { status: 'error', message: 'Please fill in your name, email, and a short message.' };
//   }

//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(email)) {
//     return { status: 'error', message: 'Please enter a valid email address.' };
//   }

//   if (isRateLimited(email.toLowerCase())) {
//     return {
//       status: 'error',
//       message: 'Too many submissions from this email in a short time. Please try again in a minute, or reach out on WhatsApp.',
//     };
//   }

//   try {
//     await db.insert(leads).values({
//       name,
//       email,
//       phone: phone || null,
//       company: company || null,
//       serviceInterest: service || null,
//       budgetRange: budget || null,
//       message,
//       status: 'New',
//     });
//   } catch (err) {
//     console.error('Failed to save lead:', err);
//     return {
//       status: 'error',
//       message: 'Something went wrong saving your message. Please try WhatsApp or email instead.',
//     };
//   }

//   // TODO: wire this up to an actual email delivery provider (e.g. Resend,
//   // Postmark) so the team is notified immediately, in addition to the lead
//   // being saved and visible in /admin/leads. Left as a clear integration
//   // point rather than a guessed provider, since this depends on what the
//   // client sets up. CONTACT_RECEIVING_EMAIL / RESEND_API_KEY are already
//   // reserved in .env.example for this.

//   return {
//     status: 'success',
//     message: "Thanks — we'll get back to you within one business day.",
//   };
// }

'use server';

import nodemailer from 'nodemailer';

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

// Zoho Mail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtppro.zoho.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: (process.env.SMTP_USER || 'info@analytiq.ng').trim(),
    pass: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.trim().replace(/\s+/g, '') : '',
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
});

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot spam protection
  const honeypot = formData.get('company_website');
  if (honeypot) {
    return { status: 'success', message: "Thanks — we'll get back to you shortly." };
  }

  const name = (formData.get('name') as string) || '';
  const email = (formData.get('email') as string) || '';
  const phone = (formData.get('phone') as string) || 'Not provided';
  const company = (formData.get('company') as string) || 'Not provided';
  const service = (formData.get('service') as string) || 'Not specified';
  const budget = (formData.get('budget') as string) || 'Not specified';
  const message = (formData.get('message') as string) || '';

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { status: 'error', message: 'Please fill in all required fields.' };
  }

  if (!process.env.SMTP_PASSWORD) {
    console.error('CRITICAL: SMTP_PASSWORD is not set in environment variables!');
    return {
      status: 'error',
      message: 'Server configuration error: email service not configured.',
    };
  }

  try {
    await transporter.sendMail({
      from: `"AnalytIQ Website" <${process.env.SMTP_USER || 'info@analytiq.ng'}>`,
      to: 'info@analytiq.ng',
      replyTo: email,
      subject: `New Lead: ${name} (${service})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Website Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${company}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Service:</td><td>${service}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Budget:</td><td>${budget}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3 style="margin-bottom: 6px; color: #0f172a;">Message:</h3>
          <p style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return { status: 'success', message: "Thanks — we'll get back to you within one business day." };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Zoho SMTP error:', error.message || error);
    return {
      status: 'error',
      message: `Failed to deliver message (${error.message || 'SMTP Error'}). Please reach out directly to info@analytiq.ng.`,
    };
  }
}