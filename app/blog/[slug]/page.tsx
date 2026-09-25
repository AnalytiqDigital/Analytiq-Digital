import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getBlogPostBySlug } from '@/lib/queries';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import BlogContent from '@/components/BlogContent';
import JsonLd from '@/components/JsonLd';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

function formatDate(date: Date | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.seoDescription || post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: new Date(post.publishedAt ?? Date.now()).toISOString(),
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
          {formatDate(post.publishedAt)} {post.category ? `· ${post.category}` : ''}
        </p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{post.title}</h1>
      </Section>

      <Section>
        <article className="mx-auto max-w-prose">
          <BlogContent content={post.content} />
        </article>
      </Section>

      <Section tone="off">
        <CTA
          title="Have a version of this problem in your business?"
          subtitle="Start a project and we'll talk through it directly."
        />
      </Section>
    </>
  );
}
