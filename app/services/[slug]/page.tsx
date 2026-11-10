import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { services, getServiceBySlug } from '@/lib/services-data';
import { caseStudies } from '@/lib/case-studies-data';
import Section from '@/components/Section';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import CaseStudyCard from '@/components/CaseStudyCard';
import Price from '@/components/Price';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const relatedCaseStudies = caseStudies.filter((cs) => cs.serviceSlug === service.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ name: service.name, description: service.metaDescription, path: `/services/${service.slug}` }),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Services</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">{service.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">{service.heroSubhead}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">
            Start a Project
          </Link>
          <span className="inline-block text-sm font-medium text-white/80">
            <Price amountNGN={service.fromPriceNGN} />
          </span>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">The problem</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{service.problem}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">The approach</h2>
            <p className="mt-3 leading-relaxed text-ink/70">{service.solution}</p>
          </div>
        </div>
      </Section>

      <Section tone="off">
        <h2 className="font-display text-2xl font-bold text-ink">What you get</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
              <span className="text-sm leading-relaxed text-ink/80">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-bold text-ink">Process</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => (
            <div key={step.title} className="card">
              <span className="font-display text-2xl font-bold text-accent-teal">{i + 1}</span>
              <h3 className="mt-3 font-display text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Tools &amp; stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-sm font-medium text-brand">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Typical outcomes</h2>
            <ul className="mt-4 space-y-3">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {relatedCaseStudies.length > 0 && (
        <Section>
          <h2 className="font-display text-2xl font-bold text-ink">Related case study</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedCaseStudies.map((cs) => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="off">
        <FAQ items={service.faqs} />
      </Section>

      {related.length > 0 && (
        <Section>
          <h2 className="font-display text-2xl font-bold text-ink">Related services</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="rounded-full border border-brand/20 bg-surface-off px-4 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white"
              >
                {r.name} &rarr;
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section tone="off">
        <CTA
          title={`Ready to talk about ${service.name.toLowerCase()}?`}
          subtitle={
            <>
              Book a free 15-minute consultation. Pricing for this service starts from{' '}
              <Price amountNGN={service.fromPriceNGN} variant="sentence" />, scoped to your needs.
            </>
          }
        />
      </Section>
    </>
  );
}
