'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X, Check, Loader2 } from 'lucide-react';
import { fetchJson } from '@/lib/fetch-json';

export type AiMode =
  | { kind: 'selection'; action: 'improve' | 'expand' | 'shorten' | 'tone' | 'grammar'; text: string }
  | { kind: 'doc'; action: 'continue' | 'outline' | 'headlines'; text: string }
  | { kind: 'meta'; text: string };

export interface MetaResult {
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  seoKeywords: string;
  slug: string;
}

const TITLES: Record<string, string> = {
  improve: 'Improve writing',
  expand: 'Expand with detail',
  shorten: 'Shorten',
  tone: 'Change tone',
  grammar: 'Fix grammar',
  continue: 'Continue writing',
  outline: 'Article outline',
  headlines: 'Headline ideas',
  meta: 'SEO & excerpt',
};

const TONES = ['Warmer and more direct', 'More formal and corporate', 'Simpler — plain language', 'More persuasive'];

const DOC_TABS = [
  { key: 'continue', label: 'Continue' },
  { key: 'outline', label: 'Outline' },
  { key: 'headlines', label: 'Headlines' },
] as const;

export default function AiPanel({
  mode,
  title,
  onClose,
  onInsert,
  onApplyMeta,
}: {
  mode: AiMode;
  title: string;
  onClose: () => void;
  onInsert: (text: string) => void;
  onApplyMeta?: (meta: MetaResult) => void;
}) {
  const [tone, setTone] = useState(TONES[0]);
  const [docAction, setDocAction] = useState<'continue' | 'outline' | 'headlines'>(
    mode.kind === 'doc' ? mode.action : 'continue',
  );
  const key = mode.kind === 'meta' ? 'meta' : mode.kind === 'doc' ? docAction : mode.action;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaResult | null>(null);

  async function run(customTone?: string, docActionOverride?: 'continue' | 'outline' | 'headlines') {
    setLoading(true);
    setError(null);
    setResult(null);
    setMeta(null);
    try {
      const action = mode.kind === 'doc' ? (docActionOverride ?? docAction) : mode.kind === 'meta' ? 'meta' : mode.action;
      const data = await fetchJson<{ data?: any }>('/api/admin/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode.kind === 'meta'
            ? { action: 'meta', text: mode.text, title }
            : {
                action,
                text: mode.text,
                title,
                ...(action === 'tone' ? { instruction: customTone ?? tone } : {}),
              },
        ),
      });
      if (mode.kind === 'meta' && onApplyMeta) {
        setMeta(data.data as MetaResult);
      } else {
        setResult(data.data?.result ?? '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  }

  // Run once when the panel mounts. Empty deps on purpose: the parent
  // re-renders often (typing in the title rebuilds the inline `mode` object),
  // and re-running here would wipe a just-generated result. The panel itself
  // is conditionally mounted per opening, so mount == one opening.
  useEffect(() => {
    const initialDoc = mode.kind === 'doc' ? mode.action : 'continue';
    setDocAction(initialDoc);
    if (mode.kind === 'doc') {
      run(undefined, initialDoc);
    } else if (mode.kind !== 'meta' && 'action' in mode && mode.action !== 'tone') {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <Sparkles size={17} className="text-brand" />
            {TITLES[key] ?? 'AI assistant'}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-surface-off" aria-label="Close AI panel">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {mode.kind === 'doc' && (
            <div className="flex gap-1 rounded-xl bg-surface-off p-1">
              {DOC_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setDocAction(t.key);
                    run(undefined, t.key);
                  }}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    docAction === t.key ? 'bg-white text-brand shadow' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {mode.kind === 'selection' && (
            <div className="rounded-xl bg-surface-off p-3 text-sm leading-relaxed text-ink/70">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Working on</p>
              <p className="line-clamp-6">{mode.text}</p>
            </div>
          )}

          {mode.kind !== 'meta' && 'action' in mode && mode.action === 'tone' && !result && !loading && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">Pick a tone</p>
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTone(t);
                    run(t);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-ink/80 transition hover:border-brand hover:text-brand"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <p className="flex items-center gap-2 py-8 text-center text-sm text-ink/60">
              <Loader2 size={16} className="animate-spin" /> Writing…
            </p>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button type="button" onClick={() => run()} className="mt-2 text-sm font-semibold text-brand hover:underline">
                Try again
              </button>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-brand/30 bg-brand/[0.03] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">Suggestion — review before using</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90">{result}</p>
            </div>
          )}

          {meta && (
            <div className="space-y-3 text-sm">
              {(
                [
                  ['SEO title', meta.seoTitle],
                  ['SEO description', meta.seoDescription],
                  ['Excerpt', meta.excerpt],
                  ['Keywords', meta.seoKeywords],
                  ['Slug', meta.slug],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</p>
                  <p className="leading-relaxed text-ink/90">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
          {result && (
            <button type="button" onClick={() => onInsert(result)} className="btn-primary flex-1">
              <Check size={16} className="mr-1.5" />
              {mode.kind === 'doc' ? 'Insert into article' : 'Replace selection'}
            </button>
          )}
          {meta && onApplyMeta && (
            <button type="button" onClick={() => onApplyMeta(meta)} className="btn-primary flex-1">
              <Check size={16} className="mr-1.5" /> Apply to post
            </button>
          )}
          {mode.kind === 'meta' && !meta && !loading && (
            <button type="button" onClick={() => run()} className="btn-primary flex-1">
              <Sparkles size={16} className="mr-1.5" /> Generate
            </button>
          )}
          <button type="button" onClick={onClose} className="btn-outline">
            {result || meta ? 'Discard' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
