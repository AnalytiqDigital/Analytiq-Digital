import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { services } from '@/lib/services-data';
import { solutions } from '@/lib/solutions-data';
import { getPublishedCaseStudies, getPublishedPortfolio, getActiveClients, getApprovedTestimonials } from '@/lib/queries';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';
import SolutionCard from '@/components/SolutionCard';
import CaseStudyCard from '@/components/CaseStudyCard';
import PortfolioCard from '@/components/PortfolioCard';
import ClientLogoSlider from '@/components/ClientLogoSlider';
import ReviewsSection from '@/components/ReviewsSection';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import { faqSchema } from '@/lib/schema';
import { siteConfig, whatsappLink, defaultWhatsappMessage } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'AI, Software, Automation & Data Analytics',
  description: siteConfig.positioning,
  path: '/',
});

const homeFaqs = [
  {
    question: 'Do you only work with large companies?',
    answer:
      'No. We work with SMEs, growing retail and distribution businesses, schools, hospitals, restaurants, and institutional clients across Nigeria. Engagements are scoped to fit the size and budget of the business.',
  },
  {
    question: 'Do I need to be based in Abuja to work with you?',
    answer:
      'No. We are based in Abuja and work with clients there in person where useful, but most of the work — dashboards, software, automation, AI, websites — is delivered effectively for clients anywhere in Nigeria or internationally.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Start a project or message us on WhatsApp. We talk through what you are trying to fix or build, and tell you honestly whether it is a good fit before any commitment.',
  },
  {
    question: 'What if I am not sure which service I need?',
    answer:
      "That's common. Most engagements start as a conversation about the problem, not a specific service name — see Digital Consulting for exactly that.",
  },
];

const process = [
  { title: 'Discovery call', description: 'A focused conversation about what you are trying to fix, build, or understand.' },
  { title: 'Scope & proposal', description: 'You get a clear, written scope and cost before any commitment.' },
  { title: 'Build in stages', description: 'Work happens in reviewable stages, so you see progress and can redirect early.' },
  { title: 'Handover & support', description: 'You get training, documentation, and the option of ongoing support.' },
];

export default async function HomePage() {
  const [portfolioItems, caseStudies, clients, testimonials] = await Promise.all([
    getPublishedPortfolio(),
    getPublishedCaseStudies(),
    getActiveClients(),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-teal/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-accent-light backdrop-blur-sm">
              <Sparkles size={14} /> AI-Powered Digital Transformation
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{siteConfig.positioning}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Start a Project <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card animate-float">
              <p className="eyebrow text-accent-light">What we deliver</p>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                {services.slice(0, 5).map((s) => (
                  <li key={s.slug} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 animate-pulse-glow rounded-full bg-accent-teal" />
                    <span>{s.shortDescription}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <Section tone="off" className="py-10 sm:py-12">
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-brand">AI-powered, human-checked</p>
            <p className="mt-1 text-sm text-ink/70">Automation and AI used where they genuinely help — with human oversight where it matters.</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-brand">Nigeria-first context</p>
            <p className="mt-1 text-sm text-ink/70">Built around ₦ pricing realities, local infrastructure, and how Nigerian businesses actually operate.</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-brand">Scoped before committed</p>
            <p className="mt-1 text-sm text-ink/70">Clear proposals and pricing upfront — no open-ended day-rate billing.</p>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            Six ways we help businesses run on smarter systems
          </h2>
          <p className="mt-3 text-ink/70">
            Each service is scoped independently — most engagements start with just one of these and expand once the first result is proven.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      {/* Featured Solutions */}
      <Section tone="off">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">Featured Solutions</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Ready-to-adapt business solutions</h2>
          </div>
          <Link href="/solutions" className="font-semibold text-brand hover:underline">
            View all solutions &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.slice(0, 3).map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </Section>

      {/* Portfolio preview */}
      <Section>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">Portfolio</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Recent projects</h2>
          </div>
          <Link href="/portfolio" className="font-semibold text-brand hover:underline">
            View full portfolio &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.slice(0, 3).map((item) => (
            <PortfolioCard key={item.slug} item={item as any} />
          ))}
        </div>
      </Section>

      {/* Case studies */}
      <Section tone="off">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">Case Studies</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Recent work, real outcomes</h2>
          </div>
          <Link href="/case-studies" className="font-semibold text-brand hover:underline">
            View all case studies &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs as any} />
          ))}
        </div>
      </Section>

      {/* How we work */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">A clear process, from first call to handover</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <div key={step.title} className="card">
              <span className="font-display text-2xl font-bold text-accent-teal">{i + 1}</span>
              <h3 className="mt-3 font-display text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Client logos */}
      <Section tone="off">
        <div className="mb-8 text-center">
          <p className="eyebrow">Trusted by</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">Businesses and institutions we work with</h2>
        </div>
        <ClientLogoSlider clients={clients} />
      </Section>

      {/* Google Reviews */}
      <Section>
        <ReviewsSection />
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section tone="off">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Feedback from clients</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card">
                <blockquote className="text-sm leading-relaxed text-ink/80">&ldquo;{t.content}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">
                  {t.name}
                  <span className="block font-normal text-ink/60">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section>
        <JsonLd data={faqSchema(homeFaqs)} />
        <div className="mx-auto max-w-3xl">
          <FAQ items={homeFaqs} />
        </div>
      </Section>

      {/* Final CTA */}
      <Section tone="off">
        <CTA
          title="Ready to put AI, data, and automation to work in your business?"
          subtitle="Start a project — we'll tell you honestly if it's a fit, and what a realistic first step looks like."
        />
      </Section>
    </>
  );
}
