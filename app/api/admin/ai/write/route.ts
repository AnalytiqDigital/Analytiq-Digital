import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasAdminAccess, requireWriteAccess } from '@/lib/permissions';
import {
  buildWritePrompt,
  normalizeMetaResult,
  validateWritePayload,
  META_JSON_SCHEMA,
} from '@/lib/ai-writer';

interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  nativeJson: boolean;
}

/**
 * OpenAI first (same pattern as /api/admin/ai/seo). Falls back to the
 * OpenAI-compatible AI_* settings (used by the WhatsApp agent) when
 * OPENAI_API_KEY is unset, so local dev keeps working with one key.
 */
function providerConfig(): ProviderConfig | null {
  const direct = process.env.OPENAI_API_KEY;
  if (direct) {
    return {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: direct,
      model: process.env.OPENAI_WRITER_MODEL || 'gpt-4.1-mini',
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
  const validated = validateWritePayload(body);
  if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });

  const prompt = buildWritePrompt(validated.payload);
  const isMeta = validated.payload.action === 'meta';

  const messages =
    provider.nativeJson || !isMeta
      ? [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ]
      : [
          { role: 'system', content: `${prompt.system} Respond with JSON only, matching this schema: {"seoTitle": string, "seoDescription": string, "excerpt": string, "keywords": string[], "slug": string}.` },
          { role: 'user', content: prompt.user },
        ];

  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: provider.model,
      temperature: prompt.temperature,
      max_tokens: prompt.maxTokens,
      messages,
      ...(isMeta && provider.nativeJson
        ? { response_format: { type: 'json_schema', json_schema: { name: 'blog_meta', strict: true, schema: META_JSON_SCHEMA } } }
        : {}),
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error?.message || data?.error || 'AI request failed';
    const status = res.status === 429 ? 429 : res.status >= 500 ? 502 : res.status;
    return NextResponse.json(
      { error: res.status === 429 ? 'AI is busy or out of quota. Try again shortly.' : String(message) },
      { status },
    );
  }

  const choice = data?.choices?.[0];
  if (choice?.message?.refusal) {
    return NextResponse.json({ error: 'The AI declined to process that text.' }, { status: 422 });
  }
  const text = typeof choice?.message?.content === 'string' ? choice.message.content.trim() : '';
  if (!text) return NextResponse.json({ error: 'The AI returned an empty response. Try again.' }, { status: 502 });

  if (isMeta) {
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ data: normalizeMetaResult(parsed) });
    } catch {
      // Fallback providers sometimes wrap JSON in prose — extract the object.
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return NextResponse.json({ data: normalizeMetaResult(JSON.parse(match[0])) });
        } catch {
          /* fall through */
        }
      }
      return NextResponse.json({ error: 'The AI returned an unexpected response. Try again.' }, { status: 502 });
    }
  }

  return NextResponse.json({ data: { result: text } });
}
