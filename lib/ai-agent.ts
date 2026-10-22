// AI sales/agent brain for the WhatsApp assistant (server-only).
//
// Knowledge base: set KNOWLEDGE_BASE_URL to a publicly readable plain-text
// document (for a Google Doc shared "anyone with the link", use
// https://docs.google.com/document/d/<ID>/export?format=txt). It is fetched
// and cached for 10 minutes.

import { siteConfig } from './site-config';

const KNOWLEDGE_CACHE_MS = 10 * 60 * 1000;
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const MAX_REPLY_CHARS = 900;

let knowledgeCache: { text: string; fetchedAt: number } | null = null;

/** Pull the first email address out of a customer message, if any. */
export function extractEmail(text: string): string | null {
  const match = text.match(EMAIL_PATTERN);
  return match ? match[0].toLowerCase() : null;
}

/**
 * Ask for the customer's email once, warmly, after a few exchanges —
 * never on the first message, never twice, never if we already have it.
 */
export function shouldAskForEmail(inboundCount: number, hasEmail: boolean): boolean {
  return !hasEmail && inboundCount >= 3;
}

export async function loadKnowledgeBase(fetcher: typeof fetch = fetch): Promise<string> {
  const url = process.env.KNOWLEDGE_BASE_URL;
  if (!url) return '';
  if (knowledgeCache && Date.now() - knowledgeCache.fetchedAt < KNOWLEDGE_CACHE_MS) {
    return knowledgeCache.text;
  }
  try {
    const res = await fetcher(url);
    if (!res.ok) throw new Error(`knowledge fetch failed (${res.status})`);
    const text = (await res.text()).slice(0, 60_000);
    knowledgeCache = { text, fetchedAt: Date.now() };
    return text;
  } catch (err) {
    console.error('Knowledge base fetch failed:', err);
    return knowledgeCache?.text ?? '';
  }
}

export function buildSystemPrompt(knowledge: string, askForEmail: boolean): string {
  return [
    `You are the friendly WhatsApp assistant for ${siteConfig.name}, a digital consultancy in Abuja, Nigeria.`,
    `Services: AI agents & WhatsApp assistants, workflow automation, Power BI dashboards & data analytics, custom software, web development and ERP solutions.`,
    `Website: ${siteConfig.url}. Book a free consultation: ${siteConfig.bookingUrl}.`,
    ``,
    `Rules:`,
    `- Answer only from the knowledge base below and the service list above. If you don't know, say so and offer to connect them with the team.`,
    `- Keep replies short (2-5 sentences), warm and professional. WhatsApp style — no markdown tables, no headers.`,
    `- Never invent prices, discounts or timelines. If pricing is not in the knowledge base, offer a free consultation instead.`,
    `- For anything complex or a ready-to-buy customer, point them to the booking link: ${siteConfig.bookingUrl}`,
    askForEmail
      ? `- At a natural pause in this reply, warmly ask for their email address so the team can send them a summary and follow up. Ask once, politely; if they decline, move on.`
      : `- Do NOT ask for their email address in this reply.`,
    ``,
    `Knowledge base:`,
    knowledge || '(no knowledge base configured)',
  ].join('\n');
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateAgentReply(params: {
  message: string;
  history: ChatTurn[];
  knowledge: string;
  askForEmail: boolean;
  fetcher?: typeof fetch;
}): Promise<string> {
  const { message, history, knowledge, askForEmail } = params;
  const fetcher = params.fetcher ?? fetch;

  const baseUrl = (process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'openai/gpt-4o-mini';
  if (!apiKey) throw new Error('AI_API_KEY is not configured');

  const res = await fetcher(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 400,
      messages: [
        { role: 'system', content: buildSystemPrompt(knowledge, askForEmail) },
        ...history.slice(-10),
        { role: 'user', content: message },
      ],
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`AI request failed (${res.status}): ${text}`);
  }

  const parsed = JSON.parse(text) as { choices?: { message?: { content?: string } }[] };
  const reply = parsed.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('AI returned an empty reply');
  return reply.slice(0, MAX_REPLY_CHARS);
}
