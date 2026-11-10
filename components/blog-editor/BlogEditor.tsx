'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Sparkles, Check } from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import SlashMenu from './SlashMenu';
import AiPanel, { type AiMode, type MetaResult } from './AiPanel';
import { CtaDialog, EmbedDialog, ImageDialog, LinkDialog } from './EditorDialogs';
import { CtaButton, Embed, RichImage } from './extensions';
import { uploadImage } from './upload';
import { legacyContentToTipTapDoc, tipTapDocToText } from '@/lib/blog-render';
import './editor.css';

export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentJson: { type: string; content?: unknown[] } | null;
  contentHtml: string | null;
  featuredImage: string | null;
  category: string;
  tags: string[];
  status: string;
  publishedAt: string | null;
  authorName: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
}

type DialogState =
  | { kind: 'link'; initial: string }
  | { kind: 'image'; initial: { src: string; alt: string; caption: string } | null }
  | { kind: 'cta' }
  | { kind: 'embed' }
  | null;

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

const SELECTION_ACTIONS = [
  { key: 'improve', label: 'Improve', hint: 'Tighten clarity and flow' },
  { key: 'expand', label: 'Expand', hint: 'Add detail and examples' },
  { key: 'shorten', label: 'Shorten', hint: 'Cut to half the length' },
  { key: 'tone', label: 'Tone', hint: 'Rewrite in a different tone' },
  { key: 'grammar', label: 'Grammar', hint: 'Fix grammar only' },
] as const;

export interface BlogEditorApi {
  /** Latest TipTap JSON document (whatever is in the canvas right now). */
  getDoc: () => unknown;
  /** Plain text of the canvas (for AI actions / reading time). */
  getText: () => string;
  /** Immediately write any pending autosave to the server. */
  flush: () => Promise<void>;
}

export default function BlogEditor({
  post,
  title,
  apiRef,
  onSaved,
  onDirtyChange,
}: {
  post: BlogPostData;
  /** Current title, owned by the parent page — autosave and AI use this. */
  title?: string;
  /** Parent passes a ref object; the editor fills it with getDoc/getText/flush. */
  apiRef?: React.MutableRefObject<BlogEditorApi | null>;
  onSaved: (savedHtml: string, savedAt: Date) => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [externalDoc] = useState(post.contentJson);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [aiMode, setAiMode] = useState<AiMode | null>(null);
  const [aiBubble, setAiBubble] = useState<{ x: number; y: number; text: string } | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [liveText, setLiveText] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{ doc: unknown; title: string } | null>(null);
  const titleRef = useRef(post.title);
  const canvasRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<unknown>(externalDoc);

  const initialDoc = useMemo(() => {
    if (post.contentJson && (post.contentJson as { type?: string }).type === 'doc') return post.contentJson;
    if (post.content) return legacyContentToTipTapDoc(post.content);
    return { type: 'doc', content: [{ type: 'paragraph' }] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    async (doc: unknown, title: string) => {
      try {
        const res = await fetch(`/api/admin/blog/${post.id}/draft`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentJson: doc, title }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Autosave failed');
        onSaved(data.data?.contentHtml ?? '', new Date(data.data?.updatedAt ?? Date.now()));
        setSaveState('saved');
        onDirtyChange?.(false);
      } catch {
        setSaveState('error');
      }
    },
    [post.id, onSaved, onDirtyChange],
  );

  const scheduleSave = useCallback(
    (doc: unknown) => {
      onDirtyChange?.(true);
      setSaveState('saving');
      pendingRef.current = { doc, title: titleRef.current };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (pendingRef.current) persist(pendingRef.current.doc, pendingRef.current.title);
      }, 2500);
    },
    [persist, onDirtyChange],
  );

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          link: false,
          codeBlock: {},
        }),
        Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
        RichImage.configure({ inline: false, allowBase64: false }),
        Placeholder.configure({ placeholder: 'Start writing… Type / for blocks.' }),
        Underline,
        CtaButton,
        Embed,
      ],
      content: initialDoc as never,
      editorProps: {
        attributes: { class: 'blog-editor-canvas' },
        handlePaste(view, event) {
          const items = Array.from(event.clipboardData?.items ?? []);
          const imageItem = items.find((i) => i.type.startsWith('image/'));
          if (!imageItem) return false;
          const file = imageItem.getAsFile();
          if (!file) return false;
          event.preventDefault();
          uploadImage(file)
            .then(({ url, alt }) => {
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src: url, alt }),
                ),
              );
            })
            .catch(() => {
              /* surface via dialog next time; keep typing uninterrupted */
            });
          return true;
        },
        handleDrop(view, event) {
          const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith('image/'));
          if (!file) return false;
          event.preventDefault();
          const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
          uploadImage(file)
            .then(({ url, alt }) => {
              const pos = coords?.pos ?? view.state.selection.from;
              view.dispatch(
                view.state.tr.insert(pos, view.state.schema.nodes.image.create({ src: url, alt })),
              );
            })
            .catch(() => undefined);
          return true;
        },
      },
      immediatelyRender: false,
      onUpdate: ({ editor: e }) => {
        const doc = e.getJSON();
        docRef.current = doc;
        setLiveText(tipTapDocToText(doc));
        scheduleSave(doc);
        setAiBubble(null);
      },
      onSelectionUpdate: ({ editor: e }) => {
        const { from, to, empty } = e.state.selection;
        if (empty) {
          setAiBubble(null);
          return;
        }
        const text = e.state.doc.textBetween(from, to, ' ').trim();
        if (text.length < 10 || text.length > 4000) {
          setAiBubble(null);
          return;
        }
        // Position the bubble near the selection inside the canvas.
        try {
          const domRange =
            typeof window !== 'undefined' && window.getSelection()?.rangeCount
              ? window.getSelection()?.getRangeAt(0)
              : null;
          const rect = domRange?.getBoundingClientRect();
          const canvas = canvasRef.current?.getBoundingClientRect();
          if (rect && canvas) {
            setAiBubble({
              x: Math.min(Math.max(rect.left - canvas.left + rect.width / 2, 60), canvas.width - 60),
              y: Math.max(rect.top - canvas.top - 8, 0),
              text,
            });
          } else {
            setAiBubble({ x: 80, y: 0, text });
          }
        } catch {
          setAiBubble({ x: 80, y: 0, text });
        }
      },
    },
    [],
  );

  // Keep the autosave title in sync with the parent's title field.
  useEffect(() => {
    titleRef.current = title ?? post.title;
  }, [title, post.title]);

  const flush = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendingRef.current) {
      const pending = pendingRef.current;
      pendingRef.current = null;
      await persist(pending.doc, pending.title);
    }
  }, [persist]);

  // Expose the live document to the parent page (for Publish + full saves).
  useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        getDoc: () => docRef.current,
        getText: () => tipTapDocToText(docRef.current),
        flush,
      };
    }
  }, [apiRef, flush]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const getDocText = useCallback(() => tipTapDocToText(docRef.current), []);

  const openAiPreset = useCallback(
    (preset?: 'outline' | 'continue') => {
      if (preset === 'outline') {
        const text = getDocText().slice(0, 8000) || titleRef.current;
        setAiMode({ kind: 'doc', action: 'outline', text });
      } else if (preset === 'continue') {
        const text = getDocText().slice(-8000) || titleRef.current;
        setAiMode({ kind: 'doc', action: 'continue', text });
      } else {
        // Default panel: headlines + meta over the whole draft.
        const text = getDocText().slice(0, 12000) || titleRef.current;
        setAiMode({ kind: 'doc', action: 'headlines', text });
      }
    },
    [getDocText],
  );

  const insertAtEnd = useCallback(
    (text: string) => {
      if (!editor) return;
      const paragraphs = text.split(/\n\n+/).filter(Boolean);
      editor.chain().focus('end').run();
      for (const p of paragraphs) {
        editor.chain().focus('end').insertContent({ type: 'paragraph', content: [{ type: 'text', text: p }] }).run();
      }
      setAiMode(null);
    },
    [editor],
  );

  const replaceSelection = useCallback(
    (text: string) => {
      if (!editor) return;
      editor.chain().focus().deleteSelection().insertContent(text).run();
      setAiMode(null);
    },
    [editor],
  );

  const applyMeta = useCallback(
    (meta: MetaResult) => {
      setAiMode(null);
      window.dispatchEvent(new CustomEvent('blog-editor:apply-meta', { detail: meta }));
    },
    [],
  );

  // Toolbar link dialog
  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    setDialog({ kind: 'link', initial: prev });
  }, [editor]);

  const applyLink = useCallback(
    (url: string | null) => {
      if (!editor) return;
      if (!url) {
        editor.chain().focus().unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
      setDialog(null);
    },
    [editor],
  );

  const openImageDialog = useCallback(() => {
    if (!editor) return;
    const attrs = editor.getAttributes('image');
    setDialog({
      kind: 'image',
      initial: editor.isActive('image')
        ? { src: attrs.src || '', alt: attrs.alt || '', caption: attrs.caption || '' }
        : null,
    });
  }, [editor]);

  const applyImage = useCallback(
    (img: { src: string; alt: string; caption: string }) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .setImage({ src: img.src, alt: img.alt, ...(img.caption ? { caption: img.caption } : {}) } as never)
        .run();
      setDialog(null);
    },
    [editor],
  );

  const applyCta = useCallback(
    (cta: { label: string; href: string; variant: 'primary' | 'secondary' }) => {
      if (!editor) return;
      editor.chain().focus().insertContent({ type: 'ctaButton', attrs: cta }).run();
      setDialog(null);
    },
    [editor],
  );

  const applyEmbed = useCallback(
    (url: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent({ type: 'embed', attrs: { url } }).run();
      setDialog(null);
    },
    [editor],
  );

  const words = wordCount(liveText || getDocText());
  const readingMins = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="space-y-3">
      <EditorToolbar
        editor={editor}
        callbacks={{
          onLink: openLinkDialog,
          onImage: openImageDialog,
          onCta: () => setDialog({ kind: 'cta' }),
          onEmbed: () => setDialog({ kind: 'embed' }),
          onOpenAi: () => openAiPreset(),
        }}
      />

      <div ref={canvasRef} className="blog-editor relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" style={{ minHeight: 460 }}>
        <EditorContent editor={editor} />
        <SlashMenu
          editor={editor}
          callbacks={{
            onImage: openImageDialog,
            onCta: () => setDialog({ kind: 'cta' }),
            onEmbed: () => setDialog({ kind: 'embed' }),
            onOpenAi: openAiPreset,
          }}
        />
        {aiBubble && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-full"
            style={{ left: Math.min(aiBubble.x, 180), top: aiBubble.y }}
          >
            <div className="flex items-center gap-0.5 rounded-full bg-ink py-1 pl-2.5 pr-1.5 shadow-xl">
              <Sparkles size={13} className="mr-1 shrink-0 text-white/70" />
              {SELECTION_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  title={a.hint}
                  onClick={() => {
                    setAiMode({ kind: 'selection', action: a.key, text: aiBubble.text });
                    setAiBubble(null);
                  }}
                  className="whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold text-white transition hover:bg-brand"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
        <span>{words.toLocaleString()} words</span>
        <span>{readingMins} min read</span>
        <span className="ml-auto">
          {saveState === 'saving' && 'Saving…'}
          {saveState === 'saved' && (
            <span className="inline-flex items-center gap-1 text-success">
              <Check size={13} /> Saved
            </span>
          )}
          {saveState === 'error' && <span className="text-red-600">Autosave failed — your text is still in the editor</span>}
        </span>
      </div>

      {dialog?.kind === 'link' && (
        <LinkDialog initial={dialog.initial} onSubmit={applyLink} onClose={() => setDialog(null)} />
      )}
      {dialog?.kind === 'image' && (
        <ImageDialog initial={dialog.initial} onSubmit={applyImage} onClose={() => setDialog(null)} />
      )}
      {dialog?.kind === 'cta' && <CtaDialog onSubmit={applyCta} onClose={() => setDialog(null)} />}
      {dialog?.kind === 'embed' && <EmbedDialog onSubmit={applyEmbed} onClose={() => setDialog(null)} />}

      {aiMode && (
        <AiPanel
          mode={aiMode}
          title={titleRef.current}
          onClose={() => setAiMode(null)}
          onInsert={aiMode.kind === 'doc' ? insertAtEnd : replaceSelection}
          onApplyMeta={aiMode.kind === 'meta' ? applyMeta : undefined}
        />
      )}
    </div>
  );
}

