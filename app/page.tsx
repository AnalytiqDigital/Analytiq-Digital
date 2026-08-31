import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { services } from '@/lib/services-data';
import { caseStudies } from '@/lib/case-studies-data';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';
import CaseStudyCard from '@/components/CaseStudyCard';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import { faqSchema } from '@/lib/schema';
import { siteConfig, whatsappLink, defaultWhatsappMessage } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'IT Consulting, Power BI & Custom Software for Nigerian Businesses',
  description: siteConfig.positioning,
  path: '/',
});

const homeFaqs = [
  {
    question: 'Do you only work with large companies?',
    answer:
      "No. I work with SMEs, growing retail and distribution businesses, and institutional clients across Nigeria. Engagements are scoped to fit the size and budget of the business, not a one-size-fits-all package.",
  },
  {
    question: 'Do I need to be based in Abuja to work with you?',
    answer:
      'No. I am based in Abuja and work with clients there in person where useful, but most of the work — dashboards, software, automation, websites — is delivered effectively for clients anywhere in Nigeria or internationally.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Book a free 15-minute consultation or message me on WhatsApp. We talk through what you are trying to fix or build, and I tell you honestly whether it is a good fit before any commitment.',
  },
  {
    question: 'What if I am not sure which service I need?',
    answer:
      "That's normal, and common. Most engagements start as a conversation about the problem, not a specific service name. I help you work out whether the fix is a dashboard, a piece of custom software, an automation, or something simpler.",
  },
  {
    question: 'Do you offer ongoing support after a project is delivered?',
    answer:
      'Yes, on a retainer or ad-hoc basis depending on what you need. This is discussed and agreed upfront, never assumed or added as a surprise cost later.',
  },
];

const process = [
  {
    title: 'Discovery call',
    description: 'A free 15-minute conversation about what you are trying to fix, build, or understand — no pressure, no jargon.',
  },
  {
    title: 'Scope & proposal',
    description: 'You get a clear, written scope and cost before any commitment. No vague day-rate guessing.',
  },
  {
    title: 'Build in stages',
    description: 'Work happens in reviewable stages, so you see progress and can redirect early rather than at the end.',
  },
  {
    title: 'Handover & support',
    description: 'You get training, documentation, and the option of ongoing support — the system is built to be yours, not dependent on me forever.',
  },
];

const industries = [
  'Retail & Distribution',
  'Oil & Gas Services',
  'Institutional / Public-Sector-Adjacent',
  'Professional Services',
  'Hospitality',
  'Logistics',
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-accent-light">Abuja, Nigeria &middot; IT Consulting &amp; Digital Solutions</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              IT Consulting, Power BI &amp; Custom Software for Nigerian Businesses
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              {siteConfig.positioning}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Book a Free 15-Minute Consultation
              </Link>
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                WhatsApp Me
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="eyebrow text-accent-light">What I actually deliver</p>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              {services.map((s) => (
                <li key={s.slug} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                  <span>{s.shortDescription}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust bar - qualitative, no fake counters */}
      <Section tone="off" className="py-10 sm:py-12">
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-brand">Independent consultant</p>
            <p className="mt-1 text-sm text-ink/70">Direct access to the person doing the work — not routed through account managers.</p>
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

      {/* Services grid */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            Five ways I help businesses run on better systems
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
          {caseStudies.slice(0, 3).map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </div>
      </Section>

      {/* How I work */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">How I work</p>
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

      {/* Industries */}
      <Section tone="off">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Who I work with</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Industries served</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-medium text-brand"
            >
              {industry}
            </span>
          ))}
        </div>
      </Section>

      {/* Short about */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-square w-full max-w-sm rounded-2xl bg-surface-off ring-1 ring-slate-200" aria-hidden="true" />
          <div>
            <p className="eyebrow">About the founder</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">{siteConfig.founder}</h2>
            <p className="mt-1 text-sm font-semibold text-brand">{siteConfig.founderTitle}</p>
            <p className="mt-4 leading-relaxed text-ink/70">
              I work directly with Nigerian businesses and institutions on the data, software, and automation problems that quietly cost the most time and money — the manual reporting, the disconnected spreadsheets, the software that almost fits. My background spans Power BI and data analytics, full-stack web and software development, and workflow automation, which means I diagnose the actual problem before recommending a specific tool.
            </p>
            <Link href="/about" className="mt-5 inline-block font-semibold text-brand hover:underline">
              More about my approach &rarr;
            </Link>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section tone="off">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">What clients say</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Feedback from recent engagements</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote:
                'Our monthly reporting used to take days to put together. Now it is a dashboard we check every morning, and it actually agrees across departments.',
              name: 'Operations Lead',
              context: 'Retail business, Abuja',
            },
            {
              quote:
                'The system was built around how our team already works, not the other way around. That made adoption much easier than I expected.',
              name: 'Business Owner',
              context: 'Distribution company',
            },
            {
              quote:
                'What stood out was the honesty about what we actually needed, instead of upselling features we would never use.',
              name: 'Finance Manager',
              context: 'Institutional client',
            },
          ].map((t) => (
            <figure key={t.name} className="card">
              <blockquote className="text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.name}
                <span className="block font-normal text-ink/60">{t.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

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
          title="Ready to fix the reporting, system, or process that's slowing you down?"
          subtitle="Book a free 15-minute consultation — no pressure, and I'll tell you honestly if it's a fit."
        />
      </Section>
    </>
  );
}
