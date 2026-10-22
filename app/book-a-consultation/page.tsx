import { CalendarClock, Mail, MessageSquare } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import JsonLd from '@/components/JsonLd';
import ConsultationForm from '@/components/ConsultationForm';
import { breadcrumbSchema } from '@/lib/schema';
import { siteConfig, whatsappLink } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Book a Free Consultation',
  description:
    'Book a free consultation with AnalytIQ Digital — tell us what you want to build or fix, and we will recommend the best next step for your business.',
  path: '/book-a-consultation',
});

export default function BookAConsultationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Book a Consultation', path: '/book-a-consultation' },
        ])}
      />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Book a Consultation</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Let&apos;s talk about your project — free, no obligation
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Tell us what you&apos;re trying to build or fix. We&apos;ll come back within one business
          day with an honest recommendation — even if that recommendation is &quot;you don&apos;t
          need us for this.&quot;
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-display text-xl font-bold text-ink">Tell us about your project</h2>
            <p className="mt-1 text-sm text-ink/60">
              Fill this in and we&apos;ll reply by email — or continue on WhatsApp right after
              submitting.
            </p>
            <div className="mt-6">
              <ConsultationForm />
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="card">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CalendarClock size={20} strokeWidth={2} />
              </div>
              <h3 className="font-display text-base font-bold text-ink">Prefer to pick a time?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Book a 15-minute call directly on our calendar — choose a slot that works for you.
              </p>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 inline-block"
              >
                Open the Booking Calendar
              </a>
            </div>

            <div className="card">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <MessageSquare size={20} strokeWidth={2} />
              </div>
              <h3 className="font-display text-base font-bold text-ink">Rather chat on WhatsApp?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Message us directly — our assistant replies instantly, and the team follows up in
                person.
              </p>
              <a
                href={whatsappLink(
                  "Hi AnalytIQ Digital, I'd like to book a free consultation about a project.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-4 inline-block"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="card">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Mail size={20} strokeWidth={2} />
              </div>
              <h3 className="font-display text-base font-bold text-ink">Email us directly</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand">
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
