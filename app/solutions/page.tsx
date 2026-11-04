import Link from 'next/link';
import { Bot, BarChart3, Code2 } from 'lucide-react';
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

const capabilities = [
  {
    icon: Bot,
    name: 'AI Automation',
    description:
      'AI agents, WhatsApp assistants, workflow automation and business process automation that remove repetitive work from your team.',
    href: '/ai-automation',
  },
  {
    icon: BarChart3,
    name: 'Data Analytics',
    description:
      'Power BI dashboards, automated reporting and business intelligence — your numbers, live and clear.',
    href: '/data-analytics',
  },
  {
    icon: Code2,
    name: 'Software, Web & ERP',
    description:
      'Custom software, business websites and ERP systems built around how your business actually runs.',
    href: '/services',
  },
];

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
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Broader capabilities behind every solution
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
          Every solution above is built on our core services — automation, analytics and custom
          software. Explore what sits underneath.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {capabilities.map((c) => (
            <Link key={c.name} href={c.href} className="card group flex flex-col transition hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <c.icon size={20} strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand">
                {c.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{c.description}</p>
              <span className="mt-4 text-sm font-semibold text-brand">Explore →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Need one of these adapted to your business?"
          subtitle="Book a free consultation — we'll scope it around your actual catalogue, branches, and team."
        />
      </Section>
    </>
  );
}
