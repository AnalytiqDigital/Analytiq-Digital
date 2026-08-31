import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name} — website use and general engagement terms.`,
  path: '/terms',
  noIndex: true,
});

export default function TermsPage() {
  return (
    <Section className="pt-16 sm:pt-20">
      <div className="mx-auto max-w-prose">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink/50">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 leading-relaxed text-ink/80">
          <p>
            This is a placeholder terms page for {siteConfig.name}. Replace this content with terms reviewed by
            a qualified professional, covering both website use and your actual service-engagement terms, before
            launch.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Use of this website</h2>
          <p>
            This website is provided for informational purposes about the services offered by {siteConfig.name}.
            Content, pricing indications, and case study details are illustrative starting points and are
            confirmed in writing for each specific engagement.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Service engagements</h2>
          <p>
            Any project work is governed by a separate written proposal or agreement between {siteConfig.name}
            and the client, covering scope, pricing, timeline, and deliverables. These general website terms do
            not override the terms of a signed project agreement.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Intellectual property</h2>
          <p>
            Content on this website, including copy, design, and case study descriptions, belongs to{' '}
            {siteConfig.name} unless otherwise stated and may not be reproduced without permission.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
