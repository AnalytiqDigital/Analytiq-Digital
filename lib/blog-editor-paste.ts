/**
 * Rich text pasted into the blog editor arrives with the source's colours
 * baked in (`<span style="color:#000000">` from Word, Google Docs, most
 * websites). On the site's dark canvas that is invisible text, and before the
 * toolbar gained a colour control there was no way to undo it.
 *
 * Strip colour/background declarations from pasted HTML so pasted text adopts
 * the editor's own colour. Other inline formatting (bold, links, lists, …) is
 * left alone; ProseMirror's schema decides what it keeps. Authors who want a
 * deliberate colour can set one with the toolbar.
 */

const COLOR_DECLARATION = /^(?:color|background|background-color|background-image)\s*:/i;

export function stripPastedTextColors(html: string): string {
  if (!html || !/style\s*=/i.test(html)) return html;

  return html.replace(
    /style\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (_match, doubleQuoted: string | undefined, singleQuoted: string | undefined) => {
      const kept = String(doubleQuoted ?? singleQuoted ?? '')
        .split(';')
        .map((declaration) => declaration.trim())
        .filter(Boolean)
        .filter((declaration) => !COLOR_DECLARATION.test(declaration));

      return kept.length ? `style="${kept.join('; ')}"` : '';
    },
  );
}
