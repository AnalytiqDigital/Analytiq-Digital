import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import Reveal from '@/components/Reveal';

/** The AnalytIQ product ecosystem: ERP, Academy, Services, Solutions. */
export default function EcosystemSection() {
  return (
    <section className="relative overflow-hidden bg-surface-off py-16 sm:py-20">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 animate-aurora rounded-full bg-accent-teal/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-aurora-slow rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <Reveal>
          <p className="eyebrow">One ecosystem</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Everything AnalytIQ, <span className="text-gradient">in one place</span>
          </h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            Run your business on our ERP, train your team in the Academy, and bring us in for the
            custom work in between.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {siteConfig.ecosystem.map((item, i) => (
            <Reveal key={item.href} delay={i * 90}>
              <div className="ai-border h-full">
                <div className="hover-lift flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-bold text-brand">{item.label}</h3>
                    <ArrowUpRight size={18} className="mt-1 shrink-0 text-accent-teal" />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {item.description}
                  </p>
                  {item.external ? (
                    <a
                      href={item.href}
                      className="mt-4 text-sm font-semibold text-brand hover:text-accent-teal"
                    >
                      Visit {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="mt-4 text-sm font-semibold text-brand hover:text-accent-teal"
                    >
                      Explore {item.label}
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
