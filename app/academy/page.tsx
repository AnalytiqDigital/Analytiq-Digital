import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import { breadcrumbSchema } from '@/lib/schema';
import { siteConfig, whatsappLink } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'AnalytIQ Academy — coming soon',
  description:
    'AnalytIQ Academy is our upcoming learning platform for data, AI and business automation skills. Join the waitlist for early access.',
  path: '/academy',
});

const tracks = [
  { title: 'Data & Power BI', body: 'Turn business records into dashboards owners actually use to decide.' },
  { title: 'AI for business', body: 'Practical automation, assistants and prompt craft for real workflows.' },
  { title: 'Business systems', body: 'Run inventory, sales and accounts properly using AnalytIQ ERP.' },
  { title: 'Digital foundations', body: 'Websites, SEO and online presence for Nigerian businesses.' },
];

const format = [
  'Short video lessons you can finish between customers.',
  'Real Nigerian business datasets and case studies.',
  'Guided projects with feedback, not just theory.',
  'Certificates and a community to keep you going.',
];

export default function AcademyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'AnalytIQ Academy', path: '/academy' }])} />

      <Section tone="brand" className="pb-16 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Coming soon</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">AnalytIQ Academy</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          The learning side of the AnalytIQ ecosystem: data, AI and business automation skills taught
          with Nigerian businesses in mind. We are building the first courses now.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink('Hi AnalytIQ, please add me to the Academy waitlist.')}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the waitlist
          </a>
          <Link href="/erp" className="btn-secondary">
            Explore AnalytIQ ERP
          </Link>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Planned learning tracks</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {tracks.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <div className="ai-border h-full hover-lift">
                <div className="h-full p-6">
                  <h3 className="font-display text-lg font-semibold text-brand">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">How it will work</h2>
            <ul className="mt-6 space-y-4 text-ink/80">
              {format.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink/60">
              When it launches, the Academy will live at{' '}
              <span className="font-semibold text-brand">academy.analytiq.ng</span>.
            </p>
          </div>

          <div className="ai-border">
            <div className="p-7">
              <p className="eyebrow text-brand">Get told first</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Waitlist</h3>
              <p className="mt-3 text-sm text-ink/70">
                Send us a message and we will let you know the moment enrolment opens, with founding
                student pricing.
              </p>
              <a
                href={whatsappLink('Hi AnalytIQ, please add me to the Academy waitlist.')}
                className="btn-primary mt-6 w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
              <a href={`mailto:${siteConfig.email}`} className="btn-outline mt-3 w-full">
                Email {siteConfig.email}
              </a>
              <Link href="/blog" className="btn-outline mt-3 w-full">
                Read our guides
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
