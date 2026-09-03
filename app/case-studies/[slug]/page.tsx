import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getCaseStudyBySlug } from '@/lib/queries';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return {};
  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.summary,
    path: `/case-studies/${caseStudy.slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies' },
          { name: caseStudy.title, path: `/case-studies/${caseStudy.slug}` },
        ])}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">{caseStudy.industry}</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{caseStudy.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">{caseStudy.client}</p>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-3xl gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">The challenge</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{caseStudy.challenge}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">The approach</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{caseStudy.approach}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">The solution</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{caseStudy.solution}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-surface-off p-6">
            <h2 className="font-display text-xl font-bold text-ink">Results</h2>
            <ul className="mt-4 space-y-3">
              {(caseStudy.results as string[]).map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink">Tech used</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(caseStudy.tech as string[]).map((tech) => (
                <span key={tech} className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-sm font-medium text-brand">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {caseStudy.serviceSlug && (
            <p className="text-sm text-ink/70">
              This engagement was delivered as part of{' '}
              <Link href={`/services/${caseStudy.serviceSlug}`} className="font-semibold text-brand hover:underline">
                our services
              </Link>
              .
            </p>
          )}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Have a similar problem?"
          subtitle="Start a project to talk through what a solution could look like for your business."
        />
      </Section>
    </>
  );
}
