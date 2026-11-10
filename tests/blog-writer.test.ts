import { describe, it, expect } from 'vitest';
import {
  buildWritePrompt,
  validateWritePayload,
  MAX_INPUT_CHARS,
  MIN_SELECTION_CHARS,
} from '@/lib/ai-writer';
import { normalizeSeoSuggestion } from '@/lib/seo-ai';

describe('validateWritePayload', () => {
  it('rejects unknown actions and non-objects', () => {
    expect(validateWritePayload(null)).toMatchObject({ ok: false });
    expect(validateWritePayload({ action: 'dance', text: 'hello world, this is long enough' }).ok).toBe(false);
  });

  it('requires enough selected text for rewrite actions', () => {
    const short = validateWritePayload({ action: 'improve', text: 'too short' });
    expect(short.ok).toBe(false);
    const good = validateWritePayload({ action: 'improve', text: 'This passage is long enough to work with.' });
    expect(good).toMatchObject({ ok: true });
  });

  it('requires an instruction for tone changes', () => {
    expect(validateWritePayload({ action: 'tone', text: 'A long enough passage for the tone action.' }).ok).toBe(false);
    expect(
      validateWritePayload({ action: 'tone', text: 'A long enough passage for the tone action.', instruction: 'warmer' }).ok,
    ).toBe(true);
  });

  it('allows outline/headlines from a bare topic', () => {
    expect(validateWritePayload({ action: 'outline', text: '', title: 'Power BI pricing' }).ok).toBe(true);
    expect(validateWritePayload({ action: 'headlines', text: '' }).ok).toBe(false);
  });

  it('rejects overlong input', () => {
    const long = 'x'.repeat(MAX_INPUT_CHARS + 1);
    expect(validateWritePayload({ action: 'improve', text: long }).ok).toBe(false);
  });

  it(`enforces the ${MIN_SELECTION_CHARS}-char minimum`, () => {
    expect(validateWritePayload({ action: 'grammar', text: 'x'.repeat(MIN_SELECTION_CHARS - 1) }).ok).toBe(false);
  });
});

describe('buildWritePrompt', () => {
  it('builds a system+user prompt for every action', () => {
    const text = 'Nigerian SMEs already have sales data in POS exports and notebooks.';
    for (const action of ['continue', 'improve', 'expand', 'shorten', 'grammar', 'outline', 'headlines'] as const) {
      const p = buildWritePrompt({ action, text, title: 'Test' });
      expect(p.system.length).toBeGreaterThan(20);
      expect(p.user).toContain(text.slice(0, 20));
      expect(p.maxTokens).toBeGreaterThan(0);
    }
  });

  it('carries the tone instruction into the system prompt', () => {
    const p = buildWritePrompt({ action: 'tone', text: 'A long enough passage to rewrite.', instruction: 'more formal' });
    expect(p.system).toContain('more formal');
  });

  it('keeps the meta prompt aligned with the SEO route contract', () => {
    const p = buildWritePrompt({ action: 'meta', text: 'A long enough article body for meta generation.', title: 'T' });
    expect(p.system).toContain('seoTitle');
    const suggestion = normalizeSeoSuggestion({
      seoTitle: p.system.slice(0, 10),
      seoDescription: 'd',
      excerpt: 'e',
      keywords: ['a', 'b'],
      slug: 's',
    });
    expect(typeof suggestion.slug).toBe('string');
  });
});
