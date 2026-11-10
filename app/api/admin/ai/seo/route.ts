import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import { normalizeSeoSuggestion } from '@/lib/seo-ai';

const MAX_DRAFT_CHARS = 30_000;

const SCHEMA = {
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
};

function providerConfig(): { baseUrl: string; apiKey: string; model: string; nativeJson: boolean } | null {
  const direct = process.env.OPENAI_API_KEY;
  if (direct) {
    return {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: direct,
      model: process.env.OPENAI_SEO_MODEL || 'gpt-4.1-mini',
      nativeJson: true,
    };
  }
  const compat = process.env.AI_API_KEY;
  if (compat) {
    return {
      baseUrl: (process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, ''),
      apiKey: compat,
      model: process.env.AI_MODEL || 'openai/gpt-4o-mini',
      nativeJson: false,
    };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasAdminAccess(session.role) || !requireWriteAccess(session.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const provider = providerConfig();
  if (!provider) {
    return NextResponse.json(
      { error: 'AI is not configured. Add OPENAI_API_KEY (or AI_API_KEY) to the site environment.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const draft = typeof body?.draft === 'string' ? body.draft.trim() : '';
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (draft.length < 50) {
    return NextResponse.json({ error: 'Write at least a few sentences of the article before generating.' }, { status: 400 });
  }

  // Non-OpenAI providers (OpenRouter etc.) often reject json_schema, so ask
  // for bare JSON in the prompt instead.
  const system = provider.nativeJson
    ? 'You are an SEO editor for a digital agency blog. From the article, write: seoTitle (max 60 characters, compelling, includes the main keyword), seoDescription (140-160 characters, active voice, no quotes), excerpt (1-2 sentences, max 300 characters, for the blog list), keywords (5-8 lowercase search phrases), slug (short, lowercase, hyphenated). Use the article language. Never invent facts not in the article.'
    : 'You are an SEO editor for a digital agency blog. From the article, write: seoTitle (max 60 characters, compelling, includes the main keyword), seoDescription (140-160 characters, active voice, no quotes), excerpt (1-2 sentences, max 300 characters, for the blog list), keywords (5-8 lowercase search phrases), slug (short, lowercase, hyphenated). Use the article language. Never invent facts not in the article. Respond with JSON only, matching this schema: {"seoTitle": string, "seoDescription": string, "excerpt": string, "keywords": string[], "slug": string}.';

  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `${title ? `Working title: ${title}\n\n` : ''}Article:\n${draft.slice(0, MAX_DRAFT_CHARS)}` },
      ],
      ...(provider.nativeJson
        ? { response_format: { type: 'json_schema', json_schema: { name: 'seo_metadata', strict: true, schema: SCHEMA } } }
        : {}),
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message || data?.error || 'AI request failed';
    const status = res.status === 429 ? 429 : res.status >= 500 ? 502 : res.status;
    return NextResponse.json({ error: res.status === 429 ? 'AI is busy or out of quota. Try again shortly.' : String(message) }, { status });
  }

  const choice = data?.choices?.[0];
  if (choice?.message?.refusal) return NextResponse.json({ error: 'The AI declined to process this draft.' }, { status: 422 });
  const content = typeof choice?.message?.content === 'string' ? choice.message.content.trim() : '';
  if (!content) return NextResponse.json({ error: 'The AI returned an empty response. Try again.' }, { status: 502 });
  try {
    return NextResponse.json({ data: normalizeSeoSuggestion(JSON.parse(content)) });
  } catch {
    // Fallback providers sometimes wrap JSON in prose — extract the object.
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return NextResponse.json({ data: normalizeSeoSuggestion(JSON.parse(match[0])) });
      } catch {
        /* fall through */
      }
    }
    return NextResponse.json({ error: 'The AI returned an unexpected response. Try again.' }, { status: 502 });
  }
}
