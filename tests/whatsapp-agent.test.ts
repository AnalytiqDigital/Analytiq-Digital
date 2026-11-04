import { describe, expect, it } from 'vitest';
import { extractEmail, shouldAskForEmail, buildSystemPrompt } from '../lib/ai-agent';
import { nextStatus, normalizePhone } from '../lib/whatsapp';

describe('extractEmail', () => {
  it('finds an email inside a customer message', () => {
    expect(extractEmail('Sure, reach me at John.Doe@Example.com please')).toBe('john.doe@example.com');
  });

  it('returns null when there is no email', () => {
    expect(extractEmail('How much is a 5kVA inverter?')).toBeNull();
  });
});

describe('shouldAskForEmail', () => {
  it('never asks on the first two messages', () => {
    expect(shouldAskForEmail(1, false)).toBe(false);
    expect(shouldAskForEmail(2, false)).toBe(false);
  });

  it('asks from the third message when no email is known', () => {
    expect(shouldAskForEmail(3, false)).toBe(true);
  });

  it('never asks when an email is already on file', () => {
    expect(shouldAskForEmail(5, true)).toBe(false);
  });
});

describe('buildSystemPrompt', () => {
  it('includes the booking link and the email rule only when asking', () => {
    const asking = buildSystemPrompt('KB', true);
    expect(asking).toContain('cal.com');
    expect(asking).toContain('warmly ask for their email');

    const notAsking = buildSystemPrompt('KB', false);
    expect(notAsking).toContain('Do NOT ask for their email');
  });
});

describe('nextStatus', () => {
  it('moves delivery status forward', () => {
    expect(nextStatus('accepted', 'sent')).toBe('sent');
    expect(nextStatus('sent', 'delivered')).toBe('delivered');
    expect(nextStatus('delivered', 'read')).toBe('read');
  });

  it('never lets an older status overwrite a newer one', () => {
    expect(nextStatus('delivered', 'sent')).toBe('delivered');
    expect(nextStatus('read', 'delivered')).toBe('read');
  });

  it('always records a failure', () => {
    expect(nextStatus('read', 'failed')).toBe('failed');
  });
});

describe('normalizePhone', () => {
  it('strips everything but digits', () => {
    expect(normalizePhone('+234 803 600 0004')).toBe('2348036000004');
  });
});
