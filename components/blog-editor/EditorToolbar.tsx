'use client';

import { useState, type ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Eraser,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  MonitorPlay,
  Palette,
  Sparkles,
  Heading2,
  Heading3,
} from 'lucide-react';
import { TEXT_COLORS } from './extensions';

interface ToolbarCallbacks {
  onLink: () => void;
  onImage: () => void;
  onCta: () => void;
  onEmbed: () => void;
  onOpenAi: () => void;
  onClearFormatting: () => void;
}

function TBtn({
  title,
  active,
  onClick,
  editor,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  editor: Editor | null;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={!editor}
      onClick={onClick}
      className={`rounded-lg p-2 text-sm transition disabled:opacity-40 ${
        active ? 'bg-brand text-white' : 'text-ink/70 hover:bg-brand/10 hover:text-brand'
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({
  editor,
  callbacks,
}: {
  editor: Editor | null;
  callbacks: ToolbarCallbacks;
}) {
  const [colorOpen, setColorOpen] = useState(false);
  const activeColor = (editor?.getAttributes('textStyle')?.color as string | undefined) ?? null;

  const c = (fn: (chain: any) => any) => () => {
    if (!editor) return;
    fn(editor.chain().focus()).run();
  };

  const applyColor = (color: string | null) => {
    if (!editor) return;
    if (color) editor.chain().focus().setMark('textStyle', { color }).run();
    else editor.chain().focus().unsetMark('textStyle').run();
    setColorOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
      <TBtn title="Heading 2" editor={editor} active={editor?.isActive('heading', { level: 2 })} onClick={c((ch) => ch.toggleHeading({ level: 2 }))}>
        <Heading2 size={17} />
      </TBtn>
      <TBtn title="Heading 3" editor={editor} active={editor?.isActive('heading', { level: 3 })} onClick={c((ch) => ch.toggleHeading({ level: 3 }))}>
        <Heading3 size={17} />
      </TBtn>
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <TBtn title="Bold" editor={editor} active={editor?.isActive('bold')} onClick={c((ch) => ch.toggleBold())}>
        <Bold size={17} />
      </TBtn>
      <TBtn title="Italic" editor={editor} active={editor?.isActive('italic')} onClick={c((ch) => ch.toggleItalic())}>
        <Italic size={17} />
      </TBtn>
      <TBtn title="Underline" editor={editor} active={editor?.isActive('underline')} onClick={c((ch) => ch.toggleUnderline())}>
        <UnderlineIcon size={17} />
      </TBtn>
      <TBtn title="Strikethrough" editor={editor} active={editor?.isActive('strike')} onClick={c((ch) => ch.toggleStrike())}>
        <Strikethrough size={17} />
      </TBtn>
      <div className="relative">
        <button
          type="button"
          title="Text colour"
          aria-label="Text colour"
          aria-expanded={colorOpen}
          disabled={!editor}
          onClick={() => setColorOpen((open) => !open)}
          className={`flex items-center gap-1.5 rounded-lg p-2 text-sm transition disabled:opacity-40 ${
            colorOpen || activeColor ? 'bg-brand text-white' : 'text-ink/70 hover:bg-brand/10 hover:text-brand'
          }`}
        >
          <Palette size={17} />
          <span className="h-1 w-4 rounded-full" style={{ background: activeColor || 'currentColor' }} />
        </button>
        {colorOpen && (
          <>
            <button
              type="button"
              aria-label="Close text colour picker"
              tabIndex={-1}
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setColorOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <p className="px-1 pb-1.5 text-xs font-semibold text-ink/70">Text colour</p>
              <div className="grid grid-cols-4 gap-1">
                {TEXT_COLORS.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    aria-label={label}
                    onClick={() => applyColor(value)}
                    className={`h-7 w-full rounded-md border border-white/20 transition hover:scale-105 ${
                      activeColor?.toLowerCase() === value ? 'ring-2 ring-[#30e7ff]' : ''
                    }`}
                    style={{ background: value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => applyColor(null)}
                className="mt-2 w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium text-ink/70 hover:bg-brand/10 hover:text-brand"
              >
                Reset to default colour
              </button>
            </div>
          </>
        )}
      </div>
      <TBtn title="Clear formatting" editor={editor} onClick={callbacks.onClearFormatting}>
        <Eraser size={17} />
      </TBtn>
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <TBtn title="Bullet list" editor={editor} active={editor?.isActive('bulletList')} onClick={c((ch) => ch.toggleBulletList())}>
        <List size={17} />
      </TBtn>
      <TBtn title="Numbered list" editor={editor} active={editor?.isActive('orderedList')} onClick={c((ch) => ch.toggleOrderedList())}>
        <ListOrdered size={17} />
      </TBtn>
      <TBtn title="Quote" editor={editor} active={editor?.isActive('blockquote')} onClick={c((ch) => ch.toggleBlockquote())}>
        <Quote size={17} />
      </TBtn>
      <TBtn title="Code block" editor={editor} active={editor?.isActive('codeBlock')} onClick={c((ch) => ch.toggleCodeBlock())}>
        <Code size={17} />
      </TBtn>
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <TBtn title="Add or edit link" editor={editor} active={editor?.isActive('link')} onClick={callbacks.onLink}>
        <LinkIcon size={17} />
      </TBtn>
      <TBtn title="Insert image" editor={editor} onClick={callbacks.onImage}>
        <ImageIcon size={17} />
      </TBtn>
      <TBtn title="Insert call-to-action button" editor={editor} onClick={callbacks.onCta}>
        <MousePointerClick size={17} />
      </TBtn>
      <TBtn title="Embed a YouTube video or social post" editor={editor} onClick={callbacks.onEmbed}>
        <MonitorPlay size={17} />
      </TBtn>
      <TBtn title="Insert divider" editor={editor} onClick={c((ch) => ch.setHorizontalRule())}>
        <Minus size={17} />
      </TBtn>
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <button
        type="button"
        title="Ask the AI assistant"
        disabled={!editor}
        onClick={callbacks.onOpenAi}
        className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/10 disabled:opacity-40"
      >
        <Sparkles size={15} />
        AI
      </button>
    </div>
  );
}
