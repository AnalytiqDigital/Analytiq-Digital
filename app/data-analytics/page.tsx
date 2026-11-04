import Link from 'next/link';
import { BarChart3, FileSpreadsheet, RefreshCw, ShieldCheck, Check } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Data Analytics & Power BI',
  description:
    'Power BI dashboards, automated reporting and business intelligence from AnalytIQ Digital — see your sales, operations and finance numbers clearly, updated automatically.',
  path: '/data-analytics',
});

const offerings = [
  {
    icon: BarChart3,
    name: 'Power BI Dashboards',
    description:
      'Live dashboards that show the numbers that matter — sales, stock, branches, staff performance — without anyone rebuilding a spreadsheet.',
    points: [
      'Designed around the decisions you actually make',
      'Drill down by branch, product or period',
      'Viewable on phone, tablet and office screens',
    ],
  },
  {
    icon: RefreshCw,
    name: 'Automated Reporting',
    description:
      'Daily, weekly and monthly reports that generate and send themselves — no more late-night spreadsheet work before a management meeting.',
    points: [
      'Scheduled refresh from your live data',
      'Reports delivered by email or WhatsApp',
      'Consistent numbers everyone trusts',
    ],
  },
  {
    icon: FileSpreadsheet,
    name: 'Data Cleanup & Consolidation',
    description:
      'We pull your scattered spreadsheets, POS exports and records into one clean, structured dataset your dashboards can rely on.',
    points: [
      'Merge data from multiple branches and tools',
      'Fix duplicates, gaps and inconsistent formats',
      'A single source of truth for the business',
    ],
  },
  {
    icon: ShieldCheck,
    name: 'Business Intelligence Advisory',
    description:
      'Not sure what to measure? We help you define the KPIs that actually predict growth, then build the reporting around them.',
    points: [
      'KPI definition workshops',
      'Data strategy for growing businesses',
      'Training so your team can self-serve',
    ],
  },
];

export default function DataAnalyticsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Data Analytics', path: '/data-analytics' },
        ])}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Data Analytics</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Dashboards and reports that tell you what to do next
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Power BI dashboards, automated reporting and business intelligence for Nigerian
          businesses — so decisions are made from live numbers, not guesses and month-old
          spreadsheets.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/book-a-consultation" className="btn-primary">
            Book a Free Consultation
          </Link>
          <Link href="/services/power-bi-dashboards" className="btn-secondary">
            See the Service Details
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {offerings.map((o) => (
            <div key={o.name} className="card flex flex-col">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <o.icon size={20} strokeWidth={2} />
              </div>
              <h2 className="font-display text-lg font-bold text-ink">{o.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{o.description}</p>
              <ul className="mt-4 space-y-2">
                {o.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-ink/60">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent-teal" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Want to see your business numbers clearly?"
          subtitle="Book a free consultation — bring one report you struggle with, and we'll show you what it looks like automated."
          primaryLabel="Book a Free Consultation"
          primaryHref="/book-a-consultation"
        />
      </Section>
    </>
  );
}
