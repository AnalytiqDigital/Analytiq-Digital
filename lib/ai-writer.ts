import { normalizeSeoSuggestion, type SeoSuggestion } from './seo-ai';

/**
 * Writing-assistant actions for the blog editor (server + client share these
 * pure helpers; the OpenAI fetch itself lives in the API route).
 */

export type WriteAction =
  | 'continue'
  | 'improve'
  | 'expand'
  | 'shorten'
  | 'tone'
  | 'outline'
  | 'headlines'
  | 'grammar'
  | 'meta';

export const WRITE_ACTIONS: WriteAction[] = [
  'continue',
  'improve',
  'expand',
  'shorten',
  'tone',
  'outline',
  'headlines',
  'grammar',
  'meta',
];

export const MIN_SELECTION_CHARS = 10;
export const MAX_INPUT_CHARS = 20_000;

export interface WritePayload {
  action: WriteAction;
  text: string;
  instruction?: string;
  title?: string;
}

export type ValidatedWrite =
  | { ok: true; payload: WritePayload }
  | { ok: false; error: string };

export function validateWritePayload(body: unknown): ValidatedWrite {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request body' };
  const raw = body as Record<string, unknown>;
  const action = raw.action as WriteAction;
  if (!WRITE_ACTIONS.includes(action)) return { ok: false, error: 'Unknown AI action' };
  const text = typeof raw.text === 'string' ? raw.text.trim() : '';
  const instruction = typeof raw.instruction === 'string' ? raw.instruction.trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';

  if (action === 'tone' && !instruction) {
    return { ok: false, error: 'Describe the tone you want (e.g. "warmer and more direct").' };
  }
  if (action === 'outline' || action === 'headlines') {
    if (text.length < 3 && !title) {
      return { ok: false, error: 'Give a topic or some draft text first.' };
    }
  } else if (text.length < MIN_SELECTION_CHARS) {
    return { ok: false, error: 'Select at least a sentence or two for the AI to work with.' };
  }
  if (text.length > MAX_INPUT_CHARS) {
    return { ok: false, error: 'That selection is too long — try a shorter passage.' };
  }
  return { ok: true, payload: { action, text, instruction: instruction || undefined, title: title || undefined } };
}

export interface BuiltPrompt {
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
}

const VOICE =
  'Write for Nigerian business owners and operators: practical, specific, plain language. ' +
  'No jargon, no vendor pitch, no invented statistics, prices, or timelines.';

export function buildWritePrompt(p: WritePayload): BuiltPrompt {
  const titleLine = p.title ? `Working title: ${p.title}\n\n` : '';
  switch (p.action) {
    case 'continue':
      return {
        system: `${VOICE} Continue the article below in the same voice and structure. Add 1-3 paragraphs that genuinely advance the argument. Return only the new paragraphs as plain text — no preamble, no markdown headings.`,
        user: `${titleLine}Article so far:\n${p.text}`,
        temperature: 0.7,
        maxTokens: 800,
      };
    case 'improve':
      return {
        system: `${VOICE} Rewrite the passage for clarity and flow. Preserve every fact and the original meaning. Return only the revised passage as plain text.`,
        user: p.text,
        temperature: 0.3,
        maxTokens: 1500,
      };
    case 'expand':
      return {
        system: `${VOICE} Expand the passage with concrete detail, a realistic example, or a next step the reader can act on. Stay consistent with the original claims. Return only the expanded passage as plain text.`,
        user: p.text,
        temperature: 0.6,
        maxTokens: 1500,
      };
    case 'shorten':
      return {
        system: `${VOICE} Shorten the passage to roughly half its length. Keep every key point and fact; cut filler and repetition. Return only the shortened passage as plain text.`,
        user: p.text,
        temperature: 0.3,
        maxTokens: 1200,
      };
    case 'tone':
      return {
        system: `${VOICE} Rewrite the passage in a ${p.instruction} tone. Preserve every fact and the original meaning. Return only the rewritten passage as plain text.`,
        user: p.text,
        temperature: 0.5,
        maxTokens: 1500,
      };
    case 'outline':
      return {
        system: `${VOICE} Create a tight article outline for the topic below: a working headline, then 4-7 section bullets each with one line on what the section must cover. Plain text, no preamble.`,
        user: `${titleLine}Topic / draft:\n${p.text}`,
        temperature: 0.7,
        maxTokens: 800,
      };
    case 'headlines':
      return {
        system: `${VOICE} Suggest 8 headline options for the article below: specific, curiosity-driven, under 70 characters each. Numbered list, nothing else.`,
        user: `${titleLine}Article:\n${p.text.slice(0, 8000)}`,
        temperature: 0.8,
        maxTokens: 600,
      };
    case 'grammar':
      return {
        system: `Fix grammar, spelling, and punctuation only. Do not rephrase, restructure, or change any word choice beyond what correctness requires. Return only the corrected text.`,
        user: p.text,
        temperature: 0.1,
        maxTokens: 1500,
      };
    case 'meta':
      return {
        system:
          'You are an SEO editor for a digital agency blog. From the article, write: seoTitle (max 60 characters, compelling, includes the main keyword), seoDescription (140-160 characters, active voice, no quotes), excerpt (1-2 sentences, max 300 characters, for the blog list), keywords (5-8 lowercase search phrases), slug (short, lowercase, hyphenated). Use the article language. Never invent facts not in the article.',
        user: `${titleLine}Article:\n${p.text.slice(0, 20_000)}`,
        temperature: 0.4,
        maxTokens: 500,
      };
  }
}

/** JSON schema for the `meta` action (same shape as /api/admin/ai/seo). */
export const META_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['seoTitle', 'seoDescription', 'excerpt', 'keywords', 'slug'],
  properties: {
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    excerpt: { type: 'string' },
    keywords: { type: 'array', items: { type: 'string' } },
    slug: { type: 'string' },
  },
} as const;

export function normalizeMetaResult(parsed: unknown): SeoSuggestion {
  return normalizeSeoSuggestion(parsed);
}
