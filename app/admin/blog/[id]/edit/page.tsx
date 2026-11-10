'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Monitor, Smartphone, X } from 'lucide-react';
import BlogEditor, { type BlogEditorApi, type BlogPostData } from '@/components/blog-editor/BlogEditor';
import PublishPanel, { metaToFormPatch, postToForm, type PublishForm } from '@/components/blog-editor/PublishPanel';
import AiPanel, { type MetaResult } from '@/components/blog-editor/AiPanel';
import BlogRichContent from '@/components/BlogRichContent';
import { tipTapDocToText } from '@/lib/blog-render';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [form, setForm] = useState<PublishForm | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [metaPanel, setMetaPanel] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMobile, setPreviewMobile] = useState(false);
  const editorApi = useRef<BlogEditorApi | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load post');
        setPost(data.data);
        setForm(postToForm(data.data));
        setPreviewHtml(data.data.contentHtml || '');
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // "Review with AI" applies suggested SEO fields into the publish form.
  useEffect(() => {
    const onMeta = (e: Event) => {
      const meta = (e as CustomEvent<MetaResult>).detail;
      if (meta && form) {
        setForm({ ...form, ...metaToFormPatch(meta) });
        setDirty(true);
      }
    };
    window.addEventListener('blog-editor:apply-meta', onMeta);
    return () => window.removeEventListener('blog-editor:apply-meta', onMeta);
  }, [form]);

  const patchForm = useCallback(
    (patch: Partial<PublishForm>) => {
      setForm((f) => (f ? { ...f, ...patch } : f));
      setDirty(true);
    },
    [],
  );

  async function handleSave(publish: boolean) {
    if (!post || !form) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Flush any debounced autosave first so the body matches the canvas.
      await editorApi.current?.flush();
      const doc = editorApi.current?.getDoc();
      if (!doc) throw new Error('The editor is still loading — wait a moment and try again.');

      const status = publish ? 'published' : form.status;
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          contentJson: doc,
          featuredImage: form.featuredImage || null,
          category: form.category,
          tags: form.tags,
          status,
          publishedAt:
            status === 'published' && !form.publishedAt
              ? new Date().toISOString().slice(0, 10)
              : form.publishedAt || null,
          authorName: form.authorName,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          seoKeywords: form.seoKeywords || null,
          canonicalUrl: form.canonicalUrl || null,
          ogImage: form.ogImage || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setPost(data.data);
      setForm(postToForm(data.data));
      setPreviewHtml(data.data.contentHtml || '');
      setDirty(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateSeo() {
    if (!post || !form) return;
    setGeneratingSeo(true);
    setSaveError(null);
    try {
      await editorApi.current?.flush();
      const text = editorApi.current?.getText() || tipTapDocToText(post.contentJson) || post.content;
      const res = await fetch('/api/admin/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: text, title: form.title }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'AI generation failed');
      const s = data.data;
      patchForm({
        seoTitle: s.seoTitle || form.seoTitle,
        seoDescription: s.seoDescription || form.seoDescription,
        excerpt: s.excerpt || form.excerpt,
        seoKeywords: s.seoKeywords || form.seoKeywords,
        slug: form.slug ? form.slug : s.slug || form.slug,
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGeneratingSeo(false);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 py-16 text-center text-sm text-ink/50">
        <Loader2 size={16} className="animate-spin" /> Loading post…
      </p>
    );
  }

  if (loadError || !post || !form) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loadError || 'Post not found.'}</p>
        <Link href="/admin/blog" className="text-sm font-semibold text-brand hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-brand">
          <ArrowLeft size={16} /> Blog
        </Link>
        <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold text-ink sm:text-2xl">
          {form.title || '(Untitled)'}
        </h1>
        {dirty && <span className="text-xs font-medium text-amber-600">Unsaved changes</span>}
        {post.status === 'published' && (
          <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs font-semibold text-brand hover:underline">
            View live →
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <BlogEditor
            post={post}
            title={form.title}
            apiRef={editorApi}
            onSaved={(html) => setPreviewHtml(html)}
            onDirtyChange={setDirty}
          />
        </div>
        <PublishPanel
          form={form}
          setForm={patchForm}
          previewHtml={previewHtml}
          saving={saving}
          saveError={saveError}
          generatingSeo={generatingSeo}
          onGenerateSeo={handleGenerateSeo}
          onOpenMetaAi={() => setMetaPanel(true)}
          onSave={handleSave}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>

      {metaPanel && (
        <AiPanel
          mode={{
            kind: 'meta',
            text: (editorApi.current?.getText() || tipTapDocToText(post.contentJson) || post.content).slice(0, 12000),
          }}
          title={form.title}
          onClose={() => setMetaPanel(false)}
          onInsert={() => setMetaPanel(false)}
          onApplyMeta={(meta) => {
            patchForm(metaToFormPatch(meta));
            setMetaPanel(false);
          }}
        />
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/60 p-4" onClick={() => setPreviewOpen(false)}>
          <div className="mx-auto mb-3 flex w-full max-w-4xl items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <p className="flex-1 text-sm font-semibold text-white">Preview — {form.status === 'published' ? 'published look' : 'draft'}</p>
            <button
              type="button"
              onClick={() => setPreviewMobile(false)}
              className={`rounded-lg p-2 ${!previewMobile ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`}
              aria-label="Desktop preview"
            >
              <Monitor size={17} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewMobile(true)}
              className={`rounded-lg p-2 ${previewMobile ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`}
              aria-label="Mobile preview"
            >
              <Smartphone size={17} />
            </button>
            <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-lg p-2 text-white/70 hover:text-white" aria-label="Close preview">
              <X size={18} />
            </button>
          </div>
          <div
            className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto rounded-2xl bg-white p-6 sm:p-10"
            style={previewMobile ? { maxWidth: 400 } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow">
              {form.publishedAt || 'Draft'} {form.category ? `· ${form.category}` : ''}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{form.title || '(Untitled)'}</h1>
            {form.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.featuredImage} alt="" className="mt-6 max-h-80 w-full rounded-xl object-cover" />
            )}
            <article className="mx-auto mt-6 max-w-prose">
              {previewHtml ? (
                <BlogRichContent html={previewHtml} />
              ) : (
                <p className="text-sm text-ink/50">Nothing to preview yet — start writing.</p>
              )}
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
