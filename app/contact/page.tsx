import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { siteConfig, whatsappLink, defaultWhatsappMessage } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with Analytiq Digital — book a free 15-minute consultation, message on WhatsApp, or send a project enquiry directly.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">Contact</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-bold sm:text-5xl">Let&rsquo;s talk about your project</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Book a free 15-minute consultation, send a message below, or reach out directly on WhatsApp or email.
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-ink">Send a message</h2>
            <p className="mt-2 text-sm text-ink/60">Fields marked * are required. I typically reply within one business day.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card">
              <h3 className="font-display text-base font-bold text-ink">Book a free consultation</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                A focused 15-minute call to talk through your project and see if it&rsquo;s a fit.
              </p>
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full">
                Book a Free 15-Minute Consultation
              </a>
            </div>

            <div className="card">
              <h3 className="font-display text-base font-bold text-ink">WhatsApp</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                For a quicker back-and-forth, message directly on WhatsApp.
              </p>
              <a
                href={whatsappLink(defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-4 w-full"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="card">
              <h3 className="font-display text-base font-bold text-ink">Email</h3>
              <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-sm font-medium text-brand hover:underline">
                {siteConfig.email}
              </a>
            </div>

            <div className="card">
              <h3 className="font-display text-base font-bold text-ink">Location</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {siteConfig.city}, {siteConfig.region}, {siteConfig.country}
                <br />
                Serving clients across Nigeria and internationally.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
