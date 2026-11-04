import Link from 'next/link';
import { Bot, MessageSquare, Workflow, Cog, Check } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'AI Automation',
  description:
    'AI agents, WhatsApp assistants, workflow automation and business process automation from AnalytIQ Digital — practical automation that saves your team hours every week.',
  path: '/ai-automation',
});

const offerings = [
  {
    icon: Bot,
    name: 'AI Agents',
    description:
      'Custom AI agents that answer questions, qualify leads, draft documents and handle repetitive knowledge work — trained on your own business information.',
    points: [
      'Trained on your documents, price lists and policies',
      'Hands over to a human when it should',
      'Works inside your existing tools',
    ],
    href: '/services/ai-automation',
  },
  {
    icon: MessageSquare,
    name: 'WhatsApp Assistants',
    description:
      'An AI assistant on your business WhatsApp number that replies to customers instantly, captures their details and books them in — even at midnight.',
    points: [
      'Instant replies to common questions',
      'Captures names, emails and enquiries automatically',
      'Every contact saved and follow-up ready',
    ],
    href: '/services/ai-whatsapp-assistant',
  },
  {
    icon: Workflow,
    name: 'Workflow Automation',
    description:
      'Connect the apps you already use — forms, spreadsheets, email, CRM, accounting — so data moves on its own and nothing falls through the cracks.',
    points: [
      'New enquiries routed to the right person instantly',
      'Automatic follow-ups and reminders',
      'Built on reliable engines like n8n',
    ],
    href: '/services/ai-automation',
  },
  {
    icon: Cog,
    name: 'Business Process Automation',
    description:
      'We map how your business actually runs, then automate the slow manual steps — approvals, invoicing, reporting, stock updates — end to end.',
    points: [
      'Process review and automation roadmap',
      'Approvals, invoicing and reporting on autopilot',
      'Measured time savings from week one',
    ],
    href: '/services/custom-software',
  },
];

const steps = [
  {
    title: 'Find the bottleneck',
    description:
      'A short working session to identify the repetitive tasks costing your team the most time.',
  },
  {
    title: 'Automate one thing well',
    description:
      'We start with a single high-impact automation, prove the value, then expand from there.',
  },
  {
    title: 'Monitor and improve',
    description:
      'Every automation is logged and reviewed, so you can see exactly what it handles and where humans still step in.',
  },
];

export default function AiAutomationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI Automation', path: '/ai-automation' },
        ])}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">AI Automation</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          AI agents and automation that do the busywork for you
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          From WhatsApp assistants that reply to customers instantly, to workflows that move data
          between your tools automatically — we build practical automation for Nigerian businesses,
          not science projects.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/book-a-consultation" className="btn-primary">
            Book a Free Consultation
          </Link>
          <Link href="/services/ai-automation" className="btn-secondary">
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
              <Link
                href={o.href}
                className="mt-5 text-sm font-semibold text-brand transition hover:text-brand/80"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">How we start</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card">
              <p className="font-display text-3xl font-bold text-accent-teal">{i + 1}</p>
              <h3 className="mt-2 font-display text-base font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Ready to stop doing work a machine can do?"
          subtitle="Book a free consultation — we'll identify the first automation worth building for your business."
          primaryLabel="Book a Free Consultation"
          primaryHref="/book-a-consultation"
        />
      </Section>
    </>
  );
}
