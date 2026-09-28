export interface SeoSuggestion {
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  seoKeywords: string;
  slug: string;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

function clamp(text: unknown, max: number): string {
  const s = typeof text === 'string' ? text.trim() : '';
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
}

/** Validate and tidy the model's JSON so the form always gets safe values. */
export function normalizeSeoSuggestion(raw: any): SeoSuggestion {
  const keywords = Array.isArray(raw?.keywords)
    ? raw.keywords.filter((k: unknown) => typeof k === 'string' && k.trim()).map((k: string) => k.trim()).slice(0, 8).join(', ')
    : typeof raw?.keywords === 'string' ? raw.keywords : '';
  return {
    seoTitle: clamp(raw?.seoTitle, 60),
    seoDescription: clamp(raw?.seoDescription, 160),
    excerpt: clamp(raw?.excerpt, 300),
    seoKeywords: keywords,
    slug: slugify(typeof raw?.slug === 'string' && raw.slug ? raw.slug : raw?.seoTitle ?? ''),
  };
}
