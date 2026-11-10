/**
 * Blog rich-content helpers (pure functions, no DB, no AI — unit-testable).
 *
 * Source of truth is the TipTap JSON document (`blog_posts.content_json`).
 * Public pages render `blog_posts.content_html`, produced by
 * `renderTipTapDocToHtml`. The renderer is whitelist-based and escapes all
 * text/attributes, so its output is safe to inject with dangerouslySetInnerHTML
 * without a sanitizer library.
 */

export interface TipTapNode {
  type?: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type?: string; attrs?: Record<string, any> }>;
}

export interface TipTapDoc {
  type: 'doc';
  content?: TipTapNode[];
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only http(s) URLs are ever rendered as links, images, or embeds. */
export function safeUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/^https?:\/\/[^\s"'<>]+$/i.test(trimmed)) return trimmed;
  if (/^mailto:[^\s"'<>]+$/i.test(trimmed)) return trimmed;
  return null;
}

function renderMarks(node: TipTapNode): string {
  let inner = escapeHtml(node.text);
  for (const mark of node.marks || []) {
    switch (mark.type) {
      case 'bold':
        inner = `<strong>${inner}</strong>`;
        break;
      case 'italic':
        inner = `<em>${inner}</em>`;
        break;
      case 'underline':
        inner = `<u>${inner}</u>`;
        break;
      case 'strike':
        inner = `<s>${inner}</s>`;
        break;
      case 'code':
        inner = `<code>${inner}</code>`;
        break;
      case 'link': {
        const href = safeUrl(mark.attrs?.href);
        inner = href
          ? `<a href="${escapeHtml(href)}">${inner}</a>`
          : inner;
        break;
      }
      default:
        break;
    }
  }
  return inner;
}

function renderInline(content: TipTapNode[] | undefined): string {
  return (content || []).map(renderNode).join('');
}

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  return m ? m[1] : null;
}

function renderEmbed(url: string): string {
  const yt = youtubeId(url);
  if (yt) {
    return (
      `<div class="embed-wrap"><iframe src="https://www.youtube.com/embed/${escapeHtml(yt)}" ` +
      `title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; ` +
      `encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    );
  }
  // X/Twitter and anything else: a clean link card (no third-party JS on our page).
  const label = /x\.com|twitter\.com/i.test(url) ? 'View post on X' : 'View embedded content';
  return `<div class="embed-wrap embed-link"><a href="${escapeHtml(url)}">${label} &rarr;</a></div>`;
}

export function renderNode(node: TipTapNode): string {
  switch (node.type) {
    case 'doc':
      return renderInline(node.content);
    case 'text':
      return renderMarks(node);
    case 'paragraph':
      return `<p>${renderInline(node.content)}</p>`;
    case 'heading': {
      const level = [1, 2, 3, 4].includes(node.attrs?.level) ? node.attrs.level : 2;
      return `<h${level}>${renderInline(node.content)}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${(node.content || []).map(renderNode).join('')}</ul>`;
    case 'orderedList': {
      const start = Number(node.attrs?.start) || 1;
      return start > 1
        ? `<ol start="${start}">${(node.content || []).map(renderNode).join('')}</ol>`
        : `<ol>${(node.content || []).map(renderNode).join('')}</ol>`;
    }
    case 'listItem':
      return `<li>${renderInline(node.content)}</li>`;
    case 'blockquote':
      return `<blockquote>${renderInline(node.content)}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${escapeHtml(
        (node.content || []).map((n) => n.text ?? '').join(''),
      )}</code></pre>`;
    case 'horizontalRule':
    case 'divider':
      return `<hr />`;
    case 'hardBreak':
      return `<br />`;
    case 'image': {
      const src = safeUrl(node.attrs?.src);
      if (!src) return '';
      const alt = escapeHtml(node.attrs?.alt);
      const caption = node.attrs?.caption ? String(node.attrs.caption) : '';
      const img = `<img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" />`;
      return caption
        ? `<figure>${img}<figcaption>${escapeHtml(caption)}</figcaption></figure>`
        : `<p>${img}</p>`;
    }
    case 'ctaButton': {
      const href = safeUrl(node.attrs?.href) || '/contact';
      const variant = node.attrs?.variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
      const label = escapeHtml(node.attrs?.label || 'Get started');
      return `<div class="cta-row"><a class="${variant}" href="${escapeHtml(href)}">${label}</a></div>`;
    }
    case 'embed': {
      const url = safeUrl(node.attrs?.url);
      return url ? renderEmbed(url) : '';
    }
    default:
      // Unknown node types render their inline children (forward-compatible).
      return renderInline(node.content);
  }
}

/** Render a TipTap JSON doc to safe HTML for the public blog page. */
export function renderTipTapDocToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return '';
  const root = doc as TipTapDoc;
  if (root.type !== 'doc' || !Array.isArray(root.content)) return '';
  return root.content.map(renderNode).join('\n');
}

/** Guard for TipTap docs coming from the editor/API before rendering or saving. */
export function isTipTapDoc(doc: unknown): doc is TipTapDoc {
  if (!doc || typeof doc !== 'object') return false;
  const d = doc as Record<string, unknown>;
  return d.type === 'doc' && Array.isArray(d.content);
}

/** Plain text of a doc — feeds AI actions, excerpts, and reading time. */
export function tipTapDocToText(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return '';
  const parts: string[] = [];
  function walk(node: TipTapNode) {
    if (node.type === 'text' && node.text) parts.push(node.text);
    if (node.type === 'ctaButton' && node.attrs?.label) parts.push(String(node.attrs.label));
    for (const child of node.content || []) walk(child);
  }
  walk(doc as TipTapNode);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/** "4 min read" from a doc (200 wpm, minimum 1). */
export function readingTimeForDoc(doc: unknown): string {
  const words = tipTapDocToText(doc).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/** Reading time from raw text (for legacy content / previews). */
export function readingTimeForText(text: string): string {
  const words = String(text || '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/**
 * Convert a legacy `content` string (`## Heading` + blank-line paragraphs)
 * into a TipTap doc, so old posts open correctly in the new editor.
 */
export function legacyContentToTipTapDoc(content: string): TipTapDoc {
  const blocks = String(content || '').split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const docContent: TipTapNode[] = [];
  for (const block of blocks) {
    if (block.startsWith('## ')) {
      docContent.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: block.replace(/^##\s+/, '') }],
      });
    } else {
      docContent.push({ type: 'paragraph', content: [{ type: 'text', text: block }] });
    }
  }
  if (docContent.length === 0) docContent.push({ type: 'paragraph' });
  return { type: 'doc', content: docContent };
}

/** Convert the static `lib/blog-data.ts` block shape into a TipTap doc (for seeding). */
export function blogDataBlocksToTipTapDoc(
  blocks: Array<{ heading?: string; paragraphs: string[] }>,
): TipTapDoc {
  const docContent: TipTapNode[] = [];
  for (const block of blocks) {
    if (block.heading) {
      docContent.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: block.heading }],
      });
    }
    for (const p of block.paragraphs || []) {
      docContent.push({ type: 'paragraph', content: [{ type: 'text', text: p }] });
    }
  }
  if (docContent.length === 0) docContent.push({ type: 'paragraph' });
  return { type: 'doc', content: docContent };
}

/** An empty doc for the "New post" flow. */
export function emptyTipTapDoc(): TipTapDoc {
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}
