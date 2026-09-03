import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import CaseStudyCard from '@/components/CaseStudyCard';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { getPublishedCaseStudies } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'Real project outcomes for Nigerian businesses — Power BI dashboards, AI automation, and custom software, with measurable results.',
  path: '/case-studies',
});

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Case Studies</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Recent work, and the outcomes that mattered
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          A selection of engagements across dashboards, automation, and custom systems. Client names are withheld where requested — the numbers and approach are real.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs as any} />
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Want a similar outcome for your business?"
          subtitle="Start a project to talk through your specific situation."
        />
      </Section>
    </>
  );
}
