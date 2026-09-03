import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import SolutionCard from '@/components/SolutionCard';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { solutions } from '@/lib/solutions-data';

export const metadata = buildMetadata({
  title: 'Solutions',
  description:
    'Featured business solutions from AnalytIQ Digital — Cloud POS, inventory management, CRM, reporting dashboards, restaurant ordering, and school management, adapted to your business.',
  path: '/solutions',
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Solutions</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Practical, ready-to-adapt business solutions
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Common operational needs we build for regularly — each adapted to your specific catalogue, branches, and workflow rather than sold as a rigid one-size-fits-all product.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Need one of these adapted to your business?"
          subtitle="Start a project — we'll scope it around your actual catalogue, branches, and team."
        />
      </Section>
    </>
  );
}
