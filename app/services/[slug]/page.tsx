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
import Magnetic from '@/components/Magnetic';
import NeuralField from '@/components/NeuralField';
import CinematicReveal, { StaggerWords } from '@/components/CinematicReveal';
import ServicePersona, { PersonaRelated, personaHeading } from '@/components/ServicePersona';
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

      <Section tone="brand" data-hero-field className="pb-14 pt-16 sm:pt-20">
        <NeuralField density={0.7} />
        <p className="eyebrow relative text-accent-light">Services</p>
        <h1 className="headline-glow relative mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          <StaggerWords text={service.name} baseDelay={120} step={110} />
        </h1>
        <CinematicReveal delay={420} y={20}>
          <p className="relative mt-4 max-w-2xl text-lg text-white/85">{service.heroSubhead}</p>
        </CinematicReveal>
        <CinematicReveal delay={580} y={20}>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic strength={22}>
              <Link href="/contact" className="btn-primary">
                Start a Project
              </Link>
            </Magnetic>
            <span className="inline-block text-sm font-medium text-white/80">
              <Price amountNGN={service.fromPriceNGN} />
            </span>
          </div>
        </CinematicReveal>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <CinematicReveal>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">The problem</h2>
              <p className="mt-3 leading-relaxed text-ink/70">{service.problem}</p>
            </div>
          </CinematicReveal>
          <CinematicReveal delay={140}>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">The approach</h2>
              <p className="mt-3 leading-relaxed text-ink/70">{service.solution}</p>
            </div>
          </CinematicReveal>
        </div>
      </Section>

      <Section tone="off">
        <CinematicReveal>
          <h2 className="font-display text-2xl font-bold text-ink">{personaHeading(service.slug).title}</h2>
          <p className="mt-2 max-w-2xl text-ink/70">{personaHeading(service.slug).sub}</p>
        </CinematicReveal>
        <div className="mt-8">
          <ServicePersona slug={service.slug} />
        </div>
      </Section>

      <Section>
        <CinematicReveal>
          <h2 className="font-display text-2xl font-bold text-ink">What you get</h2>
        </CinematicReveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.deliverables.map((item, i) => (
            <CinematicReveal as="li" key={item} delay={(i % 2) * 110} y={30}>
              <div className="flex h-full items-start gap-3 rounded-xl bg-white p-4 shadow-card">
                <span className="intel-node mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                <span className="text-sm leading-relaxed text-ink/80">{item}</span>
              </div>
            </CinematicReveal>
          ))}
        </ul>
      </Section>

      <Section tone="off">
        <CinematicReveal>
          <h2 className="font-display text-2xl font-bold text-ink">Process</h2>
        </CinematicReveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => (
            <CinematicReveal key={step.title} delay={(i % 4) * 110} y={36}>
              <div data-magnetic className="card h-full">
                <span className="font-display text-2xl font-bold text-accent-teal">{i + 1}</span>
                <h3 className="mt-3 font-display text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
              </div>
            </CinematicReveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <CinematicReveal>
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
          </CinematicReveal>
          <CinematicReveal delay={140}>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Typical outcomes</h2>
              <ul className="mt-4 space-y-3">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="intel-node mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </CinematicReveal>
        </div>
      </Section>

      {relatedCaseStudies.length > 0 && (
        <Section>
          <CinematicReveal>
            <h2 className="font-display text-2xl font-bold text-ink">Related case study</h2>
          </CinematicReveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedCaseStudies.map((cs, i) => (
              <CinematicReveal key={cs.slug} delay={(i % 2) * 110} y={36}>
                <CaseStudyCard caseStudy={cs} />
              </CinematicReveal>
            ))}
          </div>
        </Section>
      )}

      <Section tone="off">
        <CinematicReveal>
          <FAQ items={service.faqs} />
        </CinematicReveal>
      </Section>

      {related.length > 0 && (
        <Section>
          <CinematicReveal>
            <h2 className="font-display text-2xl font-bold text-ink">Related services</h2>
          </CinematicReveal>
          <div className="mt-6">
            <PersonaRelated slugs={service.relatedSlugs} />
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
