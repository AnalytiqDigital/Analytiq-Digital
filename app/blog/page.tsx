import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { getPublishedBlogPosts } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Blog',
  description:
    'Practical writing on AI, data analytics, Power BI, custom software, and automation for Nigerian businesses — no jargon, no vendor pitch.',
  path: '/blog',
});

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Blog</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Practical notes on AI, data, software, and automation
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Written for Nigerian business owners and operators — realistic, specific, and free of vendor pitching.
        </p>
      </Section>

      <Section>
        {posts.length === 0 ? (
          <p className="text-center text-sm text-ink/50">No articles published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card flex flex-col justify-between overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div>
                  {post.featuredImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.featuredImage} alt="" className="mb-4 aspect-video w-full rounded-sm object-cover" />
                  )}
                  <p className="text-xs font-medium text-ink/50">
                    {formatDate(post.publishedAt)} {post.category ? `· ${post.category}` : ''}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink">{post.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
                </div>
                <span className="mt-6 text-sm font-semibold text-accent-teal">Read article &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
