import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { blogPosts, getBlogPostBySlug } from '@/lib/blog-data';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.metaDescription,
            path: `/blog/${post.slug}`,
            datePublished: post.datePublished,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">
          {formatDate(post.datePublished)} &middot; {post.readingTime}
        </p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{post.title}</h1>
      </Section>

      <Section>
        <article className="mx-auto max-w-prose">
          {post.content.map((block, i) => (
            <div key={i} className="mb-8">
              {block.heading && (
                <h2 className="mb-3 font-display text-2xl font-bold text-ink">{block.heading}</h2>
              )}
              {block.paragraphs.map((p, j) => (
                <p key={j} className="mb-4 leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </article>
      </Section>

      <Section tone="off">
        <CTA
          title="Have a version of this problem in your business?"
          subtitle="Book a free 15-minute consultation and we'll talk through it directly."
        />
      </Section>
    </>
  );
}
