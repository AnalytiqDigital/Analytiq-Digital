'use client';

import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  Youtube,
  Sparkles,
  PenLine,
  Lightbulb,
  Type,
} from 'lucide-react';

interface SlashCallbacks {
  onImage: () => void;
  onCta: () => void;
  onEmbed: () => void;
  onOpenAi: (preset?: 'outline' | 'continue') => void;
}

export default function SlashMenu({
  editor,
  callbacks,
  className = '',
}: {
  editor: Editor | null;
  callbacks: SlashCallbacks;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Show the menu when the last typed char creates a lone "/" at a block start.
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { $from } = editor.state.selection;
      const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
      const match = /(?:^|\s)\/([a-z0-9-]*)$/i.exec(textBefore);
      if (match && $from.parent.isTextblock && $from.parentOffset <= 40) {
        setOpen(true);
        setFilter(match[1].toLowerCase());
        setIndex(0);
      } else {
        setOpen(false);
        setFilter('');
      }
    };
    editor.on('selectionUpdate', update);
    editor.on('update', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('update', update);
    };
  }, [editor]);

  const chain = () => editor?.chain().focus();

  /** Delete the "/" trigger text before inserting, so no stray slash remains. */
  function clearTrigger() {
    if (!editor) return;
    const { $from } = editor.state.selection;
    const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
    const match = /(?:^|\s)\/([a-z0-9-]*)$/i.exec(textBefore);
    if (match) {
      editor.chain().focus().deleteRange({ from: $from.pos - match[1].length - 1, to: $from.pos }).run();
    }
  }

  const allItems = [
    { key: 'h2', label: 'Heading 2', hint: 'Large section heading', icon: Heading2, run: () => chain()?.toggleHeading({ level: 2 }).run() },
    { key: 'h3', label: 'Heading 3', hint: 'Smaller sub-heading', icon: Type, run: () => chain()?.toggleHeading({ level: 3 }).run() },
    { key: 'bullet', label: 'Bullet list', hint: 'Unordered points', icon: List, run: () => chain()?.toggleBulletList().run() },
    { key: 'numbered', label: 'Numbered list', hint: 'Ordered steps', icon: ListOrdered, run: () => chain()?.toggleOrderedList().run() },
    { key: 'quote', label: 'Quote', hint: 'Pull-quote block', icon: Quote, run: () => chain()?.toggleBlockquote().run() },
    { key: 'code', label: 'Code block', hint: 'Snippet or command', icon: Code, run: () => chain()?.toggleCodeBlock().run() },
    { key: 'image', label: 'Image', hint: 'Upload or media library', icon: ImageIcon, run: () => callbacks.onImage() },
    { key: 'cta', label: 'Call-to-action', hint: 'Brand button', icon: MousePointerClick, run: () => callbacks.onCta() },
    { key: 'embed', label: 'Embed', hint: 'YouTube or social post', icon: Youtube, run: () => callbacks.onEmbed() },
    { key: 'divider', label: 'Divider', hint: 'Section break', icon: Minus, run: () => chain()?.setHorizontalRule().run() },
    { key: 'outline', label: 'Generate outline', hint: 'AI drafts a structure', icon: Lightbulb, run: () => callbacks.onOpenAi('outline') },
    { key: 'continue', label: 'Continue writing', hint: 'AI writes the next paragraphs', icon: PenLine, run: () => callbacks.onOpenAi('continue') },
    { key: 'ai', label: 'Ask AI…', hint: 'Improve, expand, shorten', icon: Sparkles, run: () => callbacks.onOpenAi() },
  ];

  const items = allItems.filter((i) => !filter || i.label.toLowerCase().includes(filter) || i.key.includes(filter));

  useEffect(() => setIndex(0), [filter]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => (i + 1) % Math.max(items.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
      } else if (e.key === 'Enter' && items[index]) {
        e.preventDefault();
        const item = items[index];
        clearTrigger();
        item.run();
        setOpen(false);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  if (!open || items.length === 0) return null;

  return (
    <div ref={rootRef} className={`absolute left-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ${className}`}>
      <p className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        Insert block
      </p>
      <div className="max-h-64 overflow-y-auto p-1">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                clearTrigger();
                item.run();
                setOpen(false);
              }}
              onMouseEnter={() => setIndex(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition ${
                i === index ? 'bg-brand/10' : 'hover:bg-surface-off'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-off text-brand">
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{item.label}</span>
                <span className="block text-xs text-ink/50">{item.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
