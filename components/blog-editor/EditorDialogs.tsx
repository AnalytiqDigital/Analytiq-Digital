'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { listMedia, uploadImage, type MediaItem } from './upload';

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white p-5 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-surface-off" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

export function LinkDialog({
  initial,
  onSubmit,
  onClose,
}: {
  initial: string;
  onSubmit: (url: string | null) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(initial);
  return (
    <Modal title="Link" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(url.trim() ? url.trim() : null);
        }}
        className="space-y-3"
      >
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className={inputCls}
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">Apply</button>
          {initial && (
            <button type="button" onClick={() => onSubmit(null)} className="btn-outline">
              Remove
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export function EmbedDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (url: string) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState('');
  return (
    <Modal title="Embed video or post" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (url.trim()) onSubmit(url.trim());
        }}
        className="space-y-3"
      >
        <input
          autoFocus
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube or X link…"
          className={inputCls}
        />
        <p className="text-xs text-ink/50">
          YouTube links play inline on the article page. X/Twitter links render as a tidy link card.
        </p>
        <button type="submit" disabled={!url.trim()} className="btn-primary w-full disabled:opacity-40">
          Insert embed
        </button>
      </form>
    </Modal>
  );
}

export function CoverField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pickerOpen || items) return;
    listMedia().then(setItems).catch((err) => setError(err instanceof Error ? err.message : 'Could not load media'));
  }, [pickerOpen, items]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadImage(file);
      onChange(uploaded.url);
      setPickerOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {value && (
        <div className="relative mb-2 h-28 overflow-hidden rounded-xl border border-slate-200 bg-surface-off">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className={`${inputCls} min-w-0 flex-1`}
        />
        <button type="button" onClick={() => setPickerOpen(true)} className="btn-outline shrink-0 px-3">
          Browse
        </button>
      </div>
      {help && <p className="mt-1 text-xs text-ink/50">{help}</p>}

      {pickerOpen && (
        <Modal title="Choose a cover image" onClose={() => setPickerOpen(false)} wide>
          <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-surface-off px-4 py-4 text-sm text-ink/60 hover:border-brand">
            <Upload size={16} /> {busy ? 'Uploading…' : 'Upload a new image'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              disabled={busy}
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
          </label>
          {error && <p className="mb-2 text-sm font-medium text-red-600">{error}</p>}
          {!items ? (
            <p className="py-6 text-center text-sm text-ink/50">Loading library…</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/50">No images yet — upload one above.</p>
          ) : (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setPickerOpen(false);
                  }}
                  className="relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-brand/60"
                >
                  <Image src={item.url} alt={item.altText || item.title || item.filename} fill sizes="150px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          {value && (
            <button type="button" onClick={() => { onChange(''); setPickerOpen(false); }} className="mt-3 w-full text-sm font-medium text-red-600 hover:underline">
              Remove current image
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

export function CtaDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (cta: { label: string; href: string; variant: 'primary' | 'secondary' }) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState('Book a free consultation');
  const [href, setHref] = useState('/contact');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  return (
    <Modal title="Call-to-action button" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (label.trim()) onSubmit({ label: label.trim(), href: href.trim() || '/contact', variant });
        }}
        className="space-y-3"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Button text</label>
          <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Link target</label>
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/contact" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Style</label>
          <select value={variant} onChange={(e) => setVariant(e.target.value as 'primary' | 'secondary')} className={inputCls}>
            <option value="primary">Primary (brand)</option>
            <option value="secondary">Secondary (outline)</option>
          </select>
        </div>
        <button type="submit" disabled={!label.trim()} className="btn-primary w-full disabled:opacity-40">
          Insert button
        </button>
      </form>
    </Modal>
  );
}

export function ImageDialog({
  initial,
  onSubmit,
  onClose,
}: {
  initial: { src: string; alt: string; caption: string } | null;
  onSubmit: (img: { src: string; alt: string; caption: string }) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'upload' | 'library' | 'url'>(initial ? 'url' : 'upload');
  const [src, setSrc] = useState(initial?.src ?? '');
  const [alt, setAlt] = useState(initial?.alt ?? '');
  const [caption, setCaption] = useState(initial?.caption ?? '');
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tab !== 'library' || items) return;
    listMedia().then(setItems).catch((err) => setError(err instanceof Error ? err.message : 'Could not load media'));
  }, [tab, items]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadImage(file);
      setSrc(uploaded.url);
      if (!alt) setAlt(uploaded.alt);
      setTab('url');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={initial ? 'Edit image' : 'Insert image'} onClose={onClose} wide>
      <div className="mb-3 flex gap-1 rounded-xl bg-surface-off p-1">
        {(['upload', 'library', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-white text-brand shadow' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'upload' && (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-surface-off px-4 py-8 text-center text-sm text-ink/60 hover:border-brand">
          <Upload size={20} />
          {busy ? 'Uploading…' : 'Choose an image to upload'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </label>
      )}

      {tab === 'library' && (
        <div className="max-h-64 overflow-y-auto">
          {!items ? (
            <p className="py-6 text-center text-sm text-ink/50">Loading library…</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/50">No images yet — upload one first.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSrc(item.url);
                    if (!alt) setAlt(item.altText || item.title || '');
                    setTab('url');
                  }}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    src === item.url ? 'border-brand' : 'border-transparent hover:border-brand/50'
                  }`}
                >
                  <Image src={item.url} alt={item.altText || item.title || item.filename} fill sizes="150px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {(tab === 'url' || src) && (
        <div className="mt-3 space-y-3">
          {src && (
            <div className="relative h-40 overflow-hidden rounded-xl border border-slate-200 bg-surface-off">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt || 'Preview'} className="h-full w-full object-contain" />
            </div>
          )}
          {tab === 'url' && (
            <input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://… (or pick from Upload / Library)" className={inputCls} />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Alt text</label>
              <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Caption (optional)</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Shown under the image" className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>}

      <button
        type="button"
        disabled={!src.trim() || busy}
        onClick={() => onSubmit({ src: src.trim(), alt: alt.trim(), caption: caption.trim() })}
        className="btn-primary mt-4 w-full disabled:opacity-40"
      >
        {initial ? 'Update image' : 'Insert image'}
      </button>
    </Modal>
  );
}
