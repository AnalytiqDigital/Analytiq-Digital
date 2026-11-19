import { Mark, Node, mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';

/**
 * Custom TipTap nodes for the blog editor. All three serialize to plain
 * attrs that lib/blog-render.ts already knows how to render to safe HTML.
 */

/**
 * Inline text colour — a minimal stand-in for `@tiptap/extension-color`, which
 * is not a dependency here. A `textStyle` mark carrying one `color` attribute,
 * serialised as `<span style="color: …">` so lib/blog-render.ts can whitelist
 * it into the published HTML.
 */
export const TextColor = Mark.create({
  name: 'textStyle',

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const color = (element as HTMLElement).style?.color;
          return color ? { color } : false;
        },
      },
    ];
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style?.color || null,
        renderHTML: (attributes: Record<string, any>) =>
          attributes.color ? { style: `color: ${attributes.color}` } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

/**
 * Swatches offered by the toolbar. They are the dark-theme palette from
 * app/globals.css, so a colour picked here stays legible in the editor and in
 * the published article (components/BlogRichContent.css).
 */
export const TEXT_COLORS: Array<{ label: string; value: string }> = [
  { label: 'Body text', value: '#f7f8ff' },
  { label: 'Muted', value: '#aeb6d3' },
  { label: 'Cyan', value: '#30e7ff' },
  { label: 'Lime', value: '#9bff6a' },
  { label: 'Gold', value: '#ffc247' },
  { label: 'Magenta', value: '#ff4eb8' },
  { label: 'Violet', value: '#8a63ff' },
  { label: 'Red', value: '#ff6b6b' },
];

export const CtaButton = Node.create({
  name: 'ctaButton',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      label: { default: 'Book a free consultation' },
      href: { default: '/contact' },
      variant: { default: 'primary' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-cta-button]' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const variant = HTMLAttributes.variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-cta-button': '', class: 'cta-row' }),
      [
        'a',
        { href: HTMLAttributes.href || '/contact', class: variant },
        HTMLAttributes.label || 'Book a free consultation',
      ],
    ];
  },
});

export const Embed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-embed]' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-embed': '', class: 'embed-wrap' }),
      ['a', { href: HTMLAttributes.url || '#' }, HTMLAttributes.url || 'Embedded content'],
    ];
  },
});

/** Image with an optional caption (stored in attrs, rendered as figcaption). */
export const RichImage = Image.extend({
  addAttributes() {
    return {
      ...(this.parent?.() ?? {}),
      caption: { default: null },
    };
  },
});
