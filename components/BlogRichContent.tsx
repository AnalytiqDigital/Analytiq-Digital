import './BlogRichContent.css';

/**
 * Renders the server-built `content_html` cache. The HTML is produced by the
 * whitelist renderer in lib/blog-render.ts (escapes all text/attrs, only
 * http(s) links/images/embeds), so it is safe to inject.
 */
export default function BlogRichContent({ html }: { html: string }) {
  if (!html) return null;
  return <div className="blog-rich" dangerouslySetInnerHTML={{ __html: html }} />;
}
