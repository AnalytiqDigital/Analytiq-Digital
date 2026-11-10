'use client';

import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
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
  Youtube,
  Sparkles,
  Heading2,
  Heading3,
} from 'lucide-react';

interface ToolbarCallbacks {
  onLink: () => void;
  onImage: () => void;
  onCta: () => void;
  onEmbed: () => void;
  onOpenAi: () => void;
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
  const c = (fn: (chain: any) => any) => () => {
    if (!editor) return;
    fn(editor.chain().focus()).run();
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
        <Youtube size={17} />
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
