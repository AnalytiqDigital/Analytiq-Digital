import { Node, mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';

/**
 * Custom TipTap nodes for the blog editor. All three serialize to plain
 * attrs that lib/blog-render.ts already knows how to render to safe HTML.
 */

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

  renderHTML({ HTMLAttributes }) {
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

  renderHTML({ HTMLAttributes }) {
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
