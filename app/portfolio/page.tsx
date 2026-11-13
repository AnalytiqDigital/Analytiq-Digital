import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import PortfolioGrid from '@/components/PortfolioGrid';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { getPublishedPortfolio } from '@/lib/queries';

// ISR: admin saves revalidate this path via revalidatePublicPages.
export const revalidate = 600;

export const metadata = buildMetadata({
  title: 'Portfolio',
  description:
    'AnalytIQ Digital portfolio — websites, custom software, AI automation, and analytics projects delivered for Nigerian businesses and institutions.',
  path: '/portfolio',
});

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Portfolio', path: '/portfolio' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Portfolio</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Websites, software, AI and analytics — delivered
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          A selection of projects across our core services. Filter by category to see relevant work.
        </p>
      </Section>

      <Section>
        <PortfolioGrid items={items as any} />
      </Section>

      <Section tone="off">
        <CTA
          title="Want something similar built for your business?"
          subtitle="Start a project and tell us what you're trying to build."
        />
      </Section>
    </>
  );
}
