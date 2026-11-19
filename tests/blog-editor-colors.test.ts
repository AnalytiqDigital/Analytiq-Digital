import { describe, it, expect } from 'vitest';
import { stripPastedTextColors } from '@/lib/blog-editor-paste';
import { safeColor, renderTipTapDocToHtml } from '@/lib/blog-render';

describe('pasted text in the blog editor', () => {
  it('drops inherited text and background colours but keeps other formatting', () => {
    const pasted =
      '<p style="margin:0cm; color:#000000; background-color: white">' +
      "<span style='color: rgb(0, 0, 0); font-weight: bold'>Hello</span></p>";

    const cleaned = stripPastedTextColors(pasted);

    expect(cleaned).not.toMatch(/color\s*:/i);
    expect(cleaned).toContain('margin:0cm');
    expect(cleaned).toContain('Hello');
  });

  it('leaves unstyled HTML alone', () => {
    const pasted = '<p><strong>Hello</strong> world</p>';
    expect(stripPastedTextColors(pasted)).toBe(pasted);
  });
});

describe('safeColor', () => {
  it('accepts the swatch palette and simple CSS colours', () => {
    expect(safeColor('#30e7ff')).toBe('#30e7ff');
    expect(safeColor(' #ABC ')).toBe('#ABC');
    expect(safeColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
  });

  it('rejects values that could break out of a style attribute', () => {
    expect(safeColor('red; background:url(javascript:alert(1))')).toBeNull();
    expect(safeColor('url("javascript:alert(1)")')).toBeNull();
    expect(safeColor(42)).toBeNull();
  });
});

describe('published article HTML', () => {
  const docWithColor = (color: unknown) => ({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello', marks: [{ type: 'textStyle', attrs: { color } }] }],
      },
    ],
  });

  it('renders a chosen text colour as an inline style', () => {
    expect(renderTipTapDocToHtml(docWithColor('#30e7ff'))).toBe(
      '<p><span style="color: #30e7ff">Hello</span></p>',
    );
  });

  it('omits the span when the colour is missing or unsafe', () => {
    expect(renderTipTapDocToHtml(docWithColor(null))).toBe('<p>Hello</p>');
    expect(renderTipTapDocToHtml(docWithColor('red;" onmouseover="alert(1)'))).toBe('<p>Hello</p>');
  });
});
