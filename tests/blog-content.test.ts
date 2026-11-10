import { describe, it, expect } from 'vitest';
import {
  renderTipTapDocToHtml,
  tipTapDocToText,
  readingTimeForDoc,
  legacyContentToTipTapDoc,
  blogDataBlocksToTipTapDoc,
  safeUrl,
} from '@/lib/blog-render';

describe('tiptap rendering', () => {
  it('renders headings, marks, and lists', () => {
    const html = renderTipTapDocToHtml({
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Hello' }] },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'bold ' , marks: [{ type: 'bold' }] },
            { type: 'text', text: 'and link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
          ],
        },
        {
          type: 'bulletList',
          content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'one' }] }] }],
        },
      ],
    });
    expect(html).toContain('<h2>Hello</h2>');
    expect(html).toContain('<strong>bold </strong>');
    expect(html).toContain('<a href="https://example.com">and link</a>');
    expect(html).toContain('<ul>');
  });

  it('renders code, quotes, images with captions, dividers, and CTA buttons', () => {
    const html = renderTipTapDocToHtml({
      type: 'doc',
      content: [
        { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'quoted' }] }] },
        { type: 'codeBlock', content: [{ type: 'text', text: 'const a = 1;' }] },
        { type: 'image', attrs: { src: 'https://cdn.example/a.png', alt: 'A', caption: 'Cap' } },
        { type: 'divider' },
        { type: 'ctaButton', attrs: { label: 'Book a call', href: '/contact', variant: 'primary' } },
      ],
    });
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<pre><code>const a = 1;</code></pre>');
    expect(html).toContain('<figcaption>Cap</figcaption>');
    expect(html).toContain('<hr />');
    expect(html).toContain('class="btn-primary"');
  });

  it('renders YouTube embeds as iframes and other URLs as link cards', () => {
    const html = renderTipTapDocToHtml({
      type: 'doc',
      content: [
        { type: 'embed', attrs: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
        { type: 'embed', attrs: { url: 'https://x.com/user/status/123' } },
      ],
    });
    expect(html).toContain('youtube.com/embed/dQw4w9WgXcQ');
    expect(html).toContain('View post on X');
  });

  it('escapes HTML and rejects unsafe URLs', () => {
    const html = renderTipTapDocToHtml({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '<script>alert(1)</script>' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] },
        { type: 'image', attrs: { src: 'javascript:alert(1)' } },
      ],
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('javascript:');
  });

  it('returns empty string for malformed docs', () => {
    expect(renderTipTapDocToHtml(null)).toBe('');
    expect(renderTipTapDocToHtml({ type: 'paragraph' })).toBe('');
  });
});

describe('safeUrl', () => {
  it('accepts http(s), mailto, and internal links; rejects the rest', () => {
    expect(safeUrl('https://example.com/a?b=1')).toBe('https://example.com/a?b=1');
    expect(safeUrl('mailto:hi@example.com')).toBe('mailto:hi@example.com');
    expect(safeUrl('/contact')).toBe('/contact');
    expect(safeUrl('/blog/some-post')).toBe('/blog/some-post');
    expect(safeUrl('#section')).toBe('#section');
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl('//evil.com/phish')).toBeNull();
    expect(safeUrl('')).toBeNull();
    expect(safeUrl(null)).toBeNull();
  });
});

describe('text + reading time', () => {
  const doc = {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Title' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Some body copy here.' }] },
      { type: 'ctaButton', attrs: { label: 'Click me' } },
    ],
  };

  it('extracts plain text including CTA labels', () => {
    expect(tipTapDocToText(doc)).toBe('Title Some body copy here. Click me');
  });

  it('computes a minimum-1-minute reading time', () => {
    expect(readingTimeForDoc(doc)).toBe('1 min read');
    const long = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: Array(450).fill('word').join(' ') }] }] };
    expect(readingTimeForDoc(long)).toBe('3 min read');
  });
});

describe('legacy conversion', () => {
  it('turns ## headings and paragraphs into a doc', () => {
    const doc = legacyContentToTipTapDoc('Intro para.\n\n## Section one\n\nBody copy.');
    expect(doc.content?.length).toBe(3);
    expect(doc.content?.[0].type).toBe('paragraph');
    expect(doc.content?.[1]).toMatchObject({ type: 'heading', attrs: { level: 2 } });
  });

  it('converts blog-data blocks for seeding', () => {
    const doc = blogDataBlocksToTipTapDoc([
      { paragraphs: ['Lead.'] },
      { heading: 'H', paragraphs: ['A.', 'B.'] },
    ]);
    expect(doc.content?.length).toBe(4);
    expect(renderTipTapDocToHtml(doc)).toContain('<h2>H</h2>');
  });
});
