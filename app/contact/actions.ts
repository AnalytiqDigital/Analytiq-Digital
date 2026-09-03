'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';

export interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

// Extremely simple in-memory rate limiting stub. In production, replace this
// with a durable store (e.g. Upstash Redis) since this resets on every
// server restart / cold start and is not shared across instances.
const submissionLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  submissionLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot field — real users never fill this in; bots often do.
  const honeypot = String(formData.get('company_website') || '');
  if (honeypot.trim().length > 0) {
    // Silently "succeed" so bots don't learn the honeypot was detected.
    return { status: 'success' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const company = String(formData.get('company') || '').trim();
  const service = String(formData.get('service') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const budget = String(formData.get('budget') || '').trim();

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in your name, email, and a short message.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  if (isRateLimited(email.toLowerCase())) {
    return {
      status: 'error',
      message: 'Too many submissions from this email in a short time. Please try again in a minute, or reach out on WhatsApp.',
    };
  }

  try {
    await db.insert(leads).values({
      name,
      email,
      phone: phone || null,
      company: company || null,
      serviceInterest: service || null,
      budgetRange: budget || null,
      message,
      status: 'New',
    });
  } catch (err) {
    console.error('Failed to save lead:', err);
    return {
      status: 'error',
      message: 'Something went wrong saving your message. Please try WhatsApp or email instead.',
    };
  }

  // TODO: wire this up to an actual email delivery provider (e.g. Resend,
  // Postmark) so the team is notified immediately, in addition to the lead
  // being saved and visible in /admin/leads. Left as a clear integration
  // point rather than a guessed provider, since this depends on what the
  // client sets up. CONTACT_RECEIVING_EMAIL / RESEND_API_KEY are already
  // reserved in .env.example for this.

  return {
    status: 'success',
    message: "Thanks — we'll get back to you within one business day.",
  };
}
