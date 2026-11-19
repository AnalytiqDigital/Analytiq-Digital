import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { services } from '@/lib/services-data';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'IT consulting services for Nigerian businesses: Power BI & data analytics, web development, custom software, business automation, and inventory/POS systems.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Services</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Six focused services, chosen to fit the actual problem
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Most engagements start with one of these and expand only once the first result is proven. Each page below covers the problem it solves, what you get, and realistic pricing.
        </p>
      </Section>

      {/* Answer-first summary: a quotable 2-sentence block for AI search engines. */}
      <Section className="pb-0">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-ink">What services does AnalytIQ Digital offer?</h2>
          <p className="mt-3 leading-relaxed text-ink/70">
            Website development, custom software, AI automation, AI WhatsApp assistants, Power BI dashboards, and digital consulting — each scoped independently for Nigerian businesses. Every engagement starts with a free consultation and a written scope with starting prices from ₦200,000 before any commitment.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Not sure which service fits your situation?"
          subtitle="That's the most common starting point. Book a free consultation and we'll work it out together."
        />
      </Section>
    </>
  );
}
