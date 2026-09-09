import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFollowUpMessage,
  buildWhatsAppFollowUpMessage,
  formatVisitNotification,
  buildRetargetingAudienceSetup,
} from '../lib/lead-automation';

test('buildFollowUpMessage includes the visitor name and recommended service', () => {
  const message = buildFollowUpMessage({
    name: 'Ada',
    serviceInterest: 'Website redesign',
    page: '/services',
  });

  assert.match(message, /Ada/i);
  assert.match(message, /Website redesign/i);
  assert.match(message, /AnalytIQ Digital/i);
});

test('formatVisitNotification summarizes a real visit event', () => {
  const summary = formatVisitNotification({
    page: '/pricing',
    referrer: 'https://google.com',
    source: 'google',
    campaign: 'summer-growth',
  });

  assert.match(summary, /pricing/i);
  assert.match(summary, /google/i);
  assert.match(summary, /summer-growth/i);
});

test('buildWhatsAppFollowUpMessage uses a short, conversion-focused message', () => {
  const message = buildWhatsAppFollowUpMessage({
    name: 'Ada',
    serviceInterest: 'Website redesign',
  });

  assert.match(message, /Ada/i);
  assert.match(message, /Website redesign/i);
  assert.match(message, /WhatsApp/i);
});

test('buildRetargetingAudienceSetup builds a usable Meta and Google audience configuration', () => {
  const config = buildRetargetingAudienceSetup({
    websiteName: 'AnalytIQ Digital',
    audienceName: 'Website Visitors',
  });

  assert.match(config.meta, /Website Visitors/i);
  assert.match(config.google, /Website Visitors/i);
  assert.equal(config.meta.includes('pixel'), true);
  assert.equal(config.google.includes('remarketing'), true);
});
