'use client';

import { useState } from 'react';
import { Sparkles, Eye, Loader2, ExternalLink } from 'lucide-react';
import DatePicker from '@/components/admin/DatePicker';
import { CoverField } from './EditorDialogs';
import type { MetaResult } from './AiPanel';
import type { BlogPostData } from './BlogEditor';

export interface PublishForm {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string;
  status: string;
  publishedAt: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImage: string;
}

export function postToForm(post: BlogPostData): PublishForm {
  const toLocal = (iso: string | null): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage ?? '',
    category: post.category,
    tags: (post.tags || []).join(', '),
    status: post.status,
    publishedAt: toLocal(post.publishedAt),
    authorName: post.authorName,
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
    seoKeywords: post.seoKeywords ?? '',
    canonicalUrl: post.canonicalUrl ?? '',
    ogImage: post.ogImage ?? '',
  };
}

const inputCls =
  'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

export default function PublishPanel({
  form,
  setForm,
  previewHtml,
  saving,
  saveError,
  generatingSeo,
  onGenerateSeo,
  onOpenMetaAi,
  onSave,
  onPreview,
}: {
  form: PublishForm;
  setForm: (patch: Partial<PublishForm>) => void;
  previewHtml: string;
  saving: boolean;
  saveError: string | null;
  generatingSeo: boolean;
  onGenerateSeo: () => void;
  onOpenMetaAi: () => void;
  onSave: (publish: boolean) => void;
  onPreview: () => void;
}) {
  const [seoOpen, setSeoOpen] = useState(false);
  const scheduled = form.status === 'scheduled';

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink/60">Publish</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Status</label>
            <select value={form.status} onChange={(e) => setForm({ status: e.target.value })} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            {scheduled && (
              <p className="mt-1 text-xs text-ink/50">Needs a future date below; stays hidden until then.</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Published at</label>
            <DatePicker value={form.publishedAt} onChange={(v) => setForm({ publishedAt: v })} />
          </div>
          <button
            type="button"
            onClick={onPreview}
            className="btn-outline w-full"
          >
            <Eye size={16} className="mr-1.5" /> Preview
          </button>
          <button
            type="button"
            onClick={() => onSave(false)}
            disabled={saving}
            className="btn-outline w-full disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => onSave(true)}
            disabled={saving}
            className="btn-primary w-full disabled:opacity-40"
          >
            {saving ? 'Saving…' : form.status === 'published' ? 'Save & keep published' : 'Publish now'}
          </button>
          {saveError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{saveError}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink/60">Post details</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">URL slug *</label>
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-xs text-ink/50">/blog/</span>
              <input value={form.slug} onChange={(e) => setForm({ slug: e.target.value })} className={`${inputCls} min-w-0`} />
            </div>
          </div>
          <CoverField label="Cover image" value={form.featuredImage} onChange={(url) => setForm({ featuredImage: url })} help="Shown on the blog listing and as the social preview fallback." />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Excerpt *</label>
            <textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ excerpt: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
              <input value={form.category} onChange={(e) => setForm({ category: e.target.value })} placeholder="Insights" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Author</label>
              <input value={form.authorName} onChange={(e) => setForm({ authorName: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Tags</label>
            <input value={form.tags} onChange={(e) => setForm({ tags: e.target.value })} placeholder="AI, data, SMEs" className={inputCls} />
            <p className="mt-1 text-xs text-ink/50">Comma-separated.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand/30 bg-brand/[0.03] p-4">
        <h2 className="mb-1 flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-ink/60">
          <Sparkles size={14} className="text-brand" /> AI & SEO
        </h2>
        <p className="mb-3 text-xs text-ink/50">Reads the article and fills the search fields.</p>
        <div className="flex gap-2">
          <button type="button" onClick={onGenerateSeo} disabled={generatingSeo} className="btn-outline flex-1 disabled:opacity-40">
            {generatingSeo ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} className="mr-1" />}
            {generatingSeo ? '…' : 'Generate'}
          </button>
          <button type="button" onClick={onOpenMetaAi} className="btn-outline flex-1">
            Review with AI
          </button>
        </div>
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="mt-2 w-full text-center text-xs font-semibold text-brand hover:underline"
        >
          {seoOpen ? 'Hide SEO fields' : 'Edit SEO fields manually'}
        </button>
        {seoOpen && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/70">SEO title</label>
              <input value={form.seoTitle} onChange={(e) => setForm({ seoTitle: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/70">SEO description</label>
              <textarea rows={2} value={form.seoDescription} onChange={(e) => setForm({ seoDescription: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/70">SEO keywords</label>
              <input value={form.seoKeywords} onChange={(e) => setForm({ seoKeywords: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/70">Canonical URL</label>
              <input value={form.canonicalUrl} onChange={(e) => setForm({ canonicalUrl: e.target.value })} className={inputCls} />
            </div>
            <CoverField label="Social image (OG)" value={form.ogImage} onChange={(url) => setForm({ ogImage: url })} />
          </div>
        )}
        {previewHtml === '' && (
          <p className="mt-2 flex items-center gap-1 text-xs text-ink/50">
            <ExternalLink size={12} /> Tip: the listing page shows the excerpt until you publish.
          </p>
        )}
      </div>
    </div>
  );
}

export function metaToFormPatch(meta: MetaResult, currentSlug?: string): Partial<PublishForm> {
  return {
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    excerpt: meta.excerpt,
    seoKeywords: meta.seoKeywords,
    // Never clobber a slug the author already set (published URLs, manual edits).
    // Only suggest one when the form doesn't have one yet.
    slug: currentSlug ? currentSlug : meta.slug,
  };
}
