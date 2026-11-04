import Link from 'next/link';
import { Check } from 'lucide-react';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';

export interface LocalLandingProps {
  path: string;
  breadcrumbName: string;
  schemaName: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  blocks: { heading: string; body: string; points?: string[] }[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
}

export default function LocalLanding(p: LocalLandingProps) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: p.breadcrumbName, path: p.path },
          ]),
          serviceSchema({ name: p.schemaName, description: p.metaDescription, path: p.path }),
          faqSchema(p.faqs),
        ]}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">{p.eyebrow}</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{p.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">{p.intro}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={p.primaryCta.href} className="btn-primary">
            {p.primaryCta.label}
          </Link>
          <Link href={p.secondaryCta.href} className="btn-secondary">
            {p.secondaryCta.label}
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {p.blocks.map((b) => (
            <div key={b.heading} className="card">
              <h2 className="font-display text-xl font-bold text-ink">{b.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{b.body}</p>
              {b.points && (
                <ul className="mt-4 space-y-2 text-sm text-ink/80">
                  {b.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-teal" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">How we work</h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {p.steps.map((s, i) => (
            <li key={s.title} className="card">
              <span className="eyebrow text-accent-teal">Step {i + 1}</span>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <FAQ items={p.faqs} />
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="font-semibold text-ink">Related:</span>
          {p.related.map((r) => (
            <Link key={r.href} href={r.href} className="text-accent-teal underline-offset-2 hover:underline">
              {r.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="off" className="py-12">
        <CTA title={p.ctaTitle} subtitle={p.ctaSubtitle} />
      </Section>
    </>
  );
}
