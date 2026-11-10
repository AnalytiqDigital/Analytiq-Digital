import ServiceCard from '@/components/ServiceCard';
import { getServiceBySlug, type ServiceData } from '@/lib/services-data';
import CinematicReveal from '@/components/CinematicReveal';
import NeuralField from '@/components/NeuralField';

/**
 * ServicePersona — each service page gets a distinct agentic personality
 * while sharing the same color system. Rendered in the deliverables /
 * content zone, keyed by service slug:
 *
 * - ai-automation:      strongest agentic feel — living decision nodes,
 *                       thinking states, data flowing between them.
 * - website-development: precise architectural assembly — modular blocks
 *                       building with blueprint energy.
 * - power-bi-dashboards: data coming alive — flowing metric particles
 *                       and cursor-following highlights.
 * - ai-whatsapp-assistant: conversational intelligence — message
 *                       formation, dialogue pulse.
 * - custom-software:    systems orchestration — layered structural depth.
 * - digital-consulting:  calm diagnostic intelligence.
 */

function AgenticNodes({ service }: { service: ServiceData }) {
  const steps = service.process.slice(0, 4);
  return (
    <div className="relative overflow-hidden rounded-xl border border-brand/20 bg-surface-off p-6" data-magnetic>
      <div className="data-stream" aria-hidden="true" />
      <p className="eyebrow">Decision paths</p>
      <div className="mt-5 space-y-0">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-6 h-full w-px bg-gradient-to-b from-accent-teal/60 to-transparent"
              />
            )}
            <span className="intel-node relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-accent-teal" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink">{step.title}</p>
                {i === 1 && (
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="think-dot h-1 w-1 rounded-full bg-accent-teal" style={{ animationDelay: '0ms' }} />
                    <span className="think-dot h-1 w-1 rounded-full bg-accent-teal" style={{ animationDelay: '250ms' }} />
                    <span className="think-dot h-1 w-1 rounded-full bg-accent-teal" style={{ animationDelay: '500ms' }} />
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/70">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlueprintAssembly({ service }: { service: ServiceData }) {
  const modules = service.deliverables.slice(0, 6);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m, i) => (
        <div
          key={m}
          className="blueprint-block relative overflow-hidden rounded-xl border border-brand/20 bg-surface-off p-5"
          style={{ animationDelay: `${i * 120}ms` }}
          data-magnetic
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(48,231,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(48,231,255,0.09) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <span aria-hidden="true" className="font-mono text-[11px] font-semibold tracking-widest text-accent-teal">
            MODULE {String(i + 1).padStart(2, '0')}
          </span>
          <p className="relative mt-2 text-sm font-semibold leading-relaxed text-ink">{m}</p>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-full bg-accent-gradient opacity-80" />
        </div>
      ))}
    </div>
  );
}

function DataAlive({ service }: { service: ServiceData }) {
  const metrics = service.outcomes.slice(0, 3);
  return (
    <div className="relative overflow-hidden rounded-xl border border-brand/20 bg-surface-off p-6 sm:p-8" data-hero-field>
      <NeuralField density={0.55} />
      <p className="eyebrow relative">Live signals</p>
      <div className="relative mt-5 grid gap-5 sm:grid-cols-3">
        {metrics.map((metric, i) => (
          <div
            key={metric}
            data-magnetic
            className="rounded-xl border border-accent-teal/25 bg-white/5 p-5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-glow"
            style={{ animationDelay: `${i * 400}ms` }}
          >
            <span aria-hidden="true" className="font-display text-2xl font-bold text-gradient">
              {['▲', '◆', '●'][i % 3]}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversationalBloom({ service }: { service: ServiceData }) {
  const lines = service.benefits.slice(0, 3);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {lines.map((line, i) => (
        <div
          key={line}
          className={`chat-bubble max-w-[85%] rounded-2xl border p-4 text-sm leading-relaxed ${
            i % 2 === 0
              ? 'border-accent-teal/30 bg-surface-off text-ink'
              : 'ml-auto border-brand/20 bg-brand-gradient text-white'
          }`}
          style={{ animationDelay: `${i * 1.4}s` }}
        >
          <span aria-hidden="true" className="mr-2 inline-flex items-center gap-1 align-middle">
            <span className="think-dot inline-block h-1.5 w-1.5 rounded-full bg-accent-teal" />
          </span>
          {line}
        </div>
      ))}
      <p className="text-center text-xs text-ink/50">Representative dialogue energy — your assistant speaks in your brand voice.</p>
    </div>
  );
}

function SystemsOrchestration({ service }: { service: ServiceData }) {
  const layers = [service.deliverables.slice(0, 2), service.process.slice(0, 2), service.outcomes.slice(0, 2)];
  const labels = ['Interface layer', 'Orchestration layer', 'Outcome layer'];
  return (
    <div className="relative mx-auto max-w-3xl">
      <span aria-hidden="true" className="strata-line absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2" />
      <div className="space-y-5">
        {layers.map((layer, li) => (
          <CinematicReveal key={labels[li]} delay={li * 140}>
            <div
              className="relative rounded-xl border border-brand/20 bg-surface-off p-5"
              style={{ marginLeft: `${li * 14}px`, marginRight: `${(layers.length - 1 - li) * 14}px` }}
            >
              <p className="eyebrow">{labels[li]}</p>
              <ul className="mt-3 space-y-2">
                {layer.map((item) => (
                  <li key={typeof item === 'string' ? item : item.title} className="flex items-start gap-2 text-sm text-ink/80">
                    <span className="intel-node mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                    <span>{typeof item === 'string' ? item : `${item.title} — ${item.description}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CinematicReveal>
        ))}
      </div>
    </div>
  );
}

function DiagnosticCalm({ service }: { service: ServiceData }) {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-xl border border-brand/20 bg-surface-off p-8 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="radar-ring absolute h-56 w-56 rounded-full border border-accent-teal/30" />
        <div className="radar-ring absolute h-40 w-40 rounded-full border border-accent-teal/20" style={{ animationDelay: '1.2s' }} />
        <div className="radar-sweep absolute h-56 w-56 rounded-full" />
      </div>
      <div className="relative">
        <p className="eyebrow">Diagnostic lens</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/75">{service.solution}</p>
      </div>
    </div>
  );
}

/** Section heading that frames each personality as a live system view. */
export function personaHeading(slug: string): { title: string; sub: string } {
  switch (slug) {
    case 'ai-automation':
      return { title: 'The agent at work', sub: 'How an automation thinks through your process — decision paths, live.' };
    case 'website-development':
      return { title: 'Precision assembly', sub: 'Your site, built like architecture — module by module, no guesswork.' };
    case 'power-bi-dashboards':
      return { title: 'Your data, alive', sub: 'The signals this dashboard keeps in view, pulsing as you watch.' };
    case 'ai-whatsapp-assistant':
      return { title: 'A conversation, not a form', sub: 'How your customers will experience the assistant.' };
    case 'custom-software':
      return { title: 'Systems, orchestrated', sub: 'Layers working together — interface, logic, and outcomes in one structure.' };
    case 'digital-consulting':
    default:
      return { title: 'The diagnostic lens', sub: 'Before any tool is chosen — an honest read of the actual problem.' };
  }
}

export default function ServicePersona({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  if (!service) return null;

  return (
    <CinematicReveal>
      {slug === 'ai-automation' && <AgenticNodes service={service} />}
      {slug === 'website-development' && <BlueprintAssembly service={service} />}
      {slug === 'power-bi-dashboards' && <DataAlive service={service} />}
      {slug === 'ai-whatsapp-assistant' && <ConversationalBloom service={service} />}
      {slug === 'custom-software' && <SystemsOrchestration service={service} />}
      {slug === 'digital-consulting' && <DiagnosticCalm service={service} />}
    </CinematicReveal>
  );
}

/** Related-services row with hover-reactive cards. */
export function PersonaRelated({ slugs }: { slugs: string[] }) {
  const items = slugs.map((s) => getServiceBySlug(s)).filter((s): s is ServiceData => Boolean(s));
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <CinematicReveal key={s.slug} delay={(i % 3) * 110} y={40}>
          <div data-magnetic className="h-full">
            <ServiceCard service={s} />
          </div>
        </CinematicReveal>
      ))}
    </div>
  );
}
