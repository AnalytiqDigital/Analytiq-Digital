import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { services } from '@/lib/services-data';
import Price from '@/components/Price';

export const metadata = buildMetadata({
  title: 'Pricing',
  description:
    'Transparent starting prices for Power BI dashboards, web development, custom software, business automation, and inventory/POS systems in Nigeria.',
  path: '/pricing',
});

const pricingFaqs = [
  {
    question: 'Why do prices start "from" a figure instead of a fixed price?',
    answer:
      'The starting figure reflects the smallest realistic version of that service. Actual cost depends on scope — number of data sources, pages, integrations, or branches involved. You get an exact, written price after the discovery call, before any commitment.',
  },
  {
    question: 'Do you require full payment upfront?',
    answer:
      'No. Projects are typically split into milestone payments tied to agreed stages of delivery, so you are never paying in full for work not yet done.',
  },
  {
    question: 'Is there a retainer option for ongoing work?',
    answer:
      'Yes. For businesses that expect regular changes, new reports, or support, a monthly retainer is available and is discussed once the first project is delivered and you know what ongoing support you actually need.',
  },
  {
    question: "I'm outside Nigeria — can I pay in USD or GHS?",
    answer:
      'Yes. Naira figures are the base, and the US Dollar and Ghana Cedi equivalents shown are indicative starting points at current rates. The exact quote and payment currency are confirmed during scoping, before any commitment.',
  },
  {
    question: 'What is not included in the starting price?',
    answer:
      'Third-party costs — such as premium Power BI licensing for very large teams, paid API access some integrations require, or hosting fees — are identified during scoping and are never a hidden surprise at the end.',
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]),
          faqSchema(pricingFaqs),
        ]}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Pricing</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Transparent starting prices, scoped to your project
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Every figure below is a realistic starting point, shown in Naira with US Dollar and Ghana Cedi equivalents. You get an exact written quote after a free discovery call — never a guess, never an open-ended day rate.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug} className="card flex flex-col justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.shortDescription}</p>
              </div>
              <div className="mt-6">
                <p className="font-display text-2xl font-bold text-brand">
                  <Price amountNGN={service.fromPriceNGN} />
                </p>
                <p className="mt-1 text-xs text-ink/50">Final price depends on scope</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-surface-off p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Larger or multi-service projects</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
            Projects combining several services — for example a custom system with an integrated Power BI reporting layer, or a website with ongoing automation — are quoted as a single custom package once scope is clear. This is usually more cost-effective than pricing each service separately.
          </p>
        </div>
      </Section>

      <Section tone="off">
        <FAQ items={pricingFaqs} title="Pricing questions" />
      </Section>

      <Section>
        <CTA
          title="Get an exact quote for your project"
          subtitle="Book a free 15-minute consultation — you'll leave with a clear idea of scope and cost."
        />
      </Section>
    </>
  );
}
