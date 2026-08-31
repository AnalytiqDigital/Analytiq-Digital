import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name} — how contact and enquiry information is collected and used.`,
  path: '/privacy',
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <Section className="pt-16 sm:pt-20">
      <div className="mx-auto max-w-prose">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink/50">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 leading-relaxed text-ink/80">
          <p>
            This is a placeholder privacy policy for {siteConfig.name}. Replace this content with a policy
            reviewed against your actual data practices (form submissions, analytics, cookies, and any
            third-party tools such as booking or analytics providers) before launch.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Information we collect</h2>
          <p>
            When you submit the contact form on this site, we collect the information you provide, which may
            include your name, email address, phone number, company name, service interest, budget range, and
            message. We do not collect payment information through this website.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">How we use your information</h2>
          <p>
            Information submitted through the contact form is used solely to respond to your enquiry and, where
            you engage us, to deliver the agreed services. We do not sell or share your information with third
            parties for marketing purposes.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Cookies &amp; analytics</h2>
          <p>
            This site may use basic analytics to understand how visitors use the site. If analytics or advertising
            cookies are enabled, this section should be updated to describe exactly what is collected and how
            visitors can opt out.
          </p>

          <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
          <p>
            Questions about this policy can be sent to{' '}
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
