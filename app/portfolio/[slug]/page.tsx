import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { getPortfolioItemBySlug, getCaseStudyBySlug } from '@/lib/queries';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.description,
    path: `/portfolio/${item.slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item) notFound();

  const relatedCaseStudy = await getCaseStudyBySlug(item.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: item.title, path: `/portfolio/${item.slug}` },
        ])}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">{item.category}</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{item.title}</h1>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          {/* UPDATED: Added relative, overflow-hidden, and the Image component */}
          <div className="relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-brand-gradient">
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                priority
                sizes="(max-width: 800px) 100vw, 800px"
                className="object-contain p-4 sm:p-8" 
              />
            ) : (
              <span className="font-display text-lg font-semibold text-white/70">{item.title}</span>
            )}
          </div>

          <p className="text-lg leading-relaxed text-ink/80">{item.description}</p>

          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-ink">Technologies used</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(item.technologies as string[]).map((tech) => (
                <span key={tech} className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-sm font-medium text-brand">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-8 inline-flex"
            >
              View Project <ExternalLink size={16} className="ml-2" />
            </a>
          )}

          {relatedCaseStudy && (
            <p className="mt-8 text-sm text-ink/70">
              Read the full story:{' '}
              <Link href={`/case-studies/${relatedCaseStudy.slug}`} className="font-semibold text-brand hover:underline">
                {relatedCaseStudy.title} case study
              </Link>
            </p>
          )}
        </div>
      </Section>

      <Section tone="off">
        <CTA title="Want something similar?" subtitle="Start a project and tell us what you're trying to build." />
      </Section>
    </>
  );
}