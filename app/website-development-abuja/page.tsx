import { buildMetadata } from '@/lib/seo';
import LocalLanding from '@/components/LocalLanding';

const description =
  'Website developer and website designer in Abuja. AnalytIQ Digital builds fast, mobile-first business websites on Next.js with SEO structure, lead forms and WhatsApp links built in.';

export const metadata = buildMetadata({
  title: 'Website Developer & Designer in Abuja',
  description,
  path: '/website-development-abuja',
});

export default function WebsiteDevelopmentAbujaPage() {
  return (
    <LocalLanding
      path="/website-development-abuja"
      breadcrumbName="Website Development in Abuja"
      schemaName="Website Development in Abuja"
      metaDescription={description}
      eyebrow="Website Development in Abuja"
      h1="Website developer and designer in Abuja for businesses that want to be found"
      intro="AnalytIQ Digital is an Abuja-based team that designs and builds fast, mobile-first websites for businesses across Nigeria. Whether you need a corporate site, a lead-generation site or a site that connects to your other tools, we build it so customers can find you and know what to do next."
      primaryCta={{ label: 'Request a Quote', href: '/book-a-consultation' }}
      secondaryCta={{ label: 'See Website Service Details', href: '/services/website-development' }}
      blocks={[
        {
          heading: 'Website development',
          body: 'We build websites on modern frameworks, Next.js by default and WordPress when your team needs to edit pages daily without a developer.',
          points: [
            'Mobile-first pages that load quickly on Nigerian mobile data',
            'Contact and lead forms connected to your email or CRM',
            'Integrations with the tools you already use',
            'Deployment, domain and analytics set up for you',
          ],
        },
        {
          heading: 'Website design',
          body: 'As website designers in Abuja we design the key pages first for your sign-off, matched to your brand, with one clear next action on every page.',
          points: [
            'Layouts that stay readable on small screens',
            'Clear calls to action: call, WhatsApp or request a quote',
            'Accessible text and informative image descriptions',
          ],
        },
        {
          heading: 'Built to be found',
          body: 'Search structure is part of the build, not an afterthought: page titles, heading hierarchy, metadata, sitemap and structured data. We do not promise rankings, but we make sure search engines can crawl and understand your site.',
        },
        {
          heading: 'Support after launch',
          body: 'We hand over a short guide for simple content edits and can discuss ongoing maintenance and improvements as your business grows.',
        },
      ]}
      steps={[
        { title: 'Scope and sitemap', description: 'We agree the pages you need, the main action on each, and what content you have versus what needs writing.' },
        { title: 'Design and build', description: 'Key pages are designed for your approval first, then built with performance and search structure included.' },
        { title: 'Launch and handover', description: 'Domain, hosting and analytics are connected and we show you how to make simple edits yourself.' },
      ]}
      faqs={[
        {
          question: 'Do you work with businesses outside Abuja?',
          answer: 'Yes. We are based in Abuja and work with businesses across Nigeria. Meetings and handover can be done remotely.',
        },
        {
          question: 'Next.js or WordPress, which should I choose?',
          answer: 'If your team needs to publish and edit content constantly, WordPress is often practical. If speed, custom features or a lean marketing site matter more, Next.js is usually a better fit. We recommend based on your needs.',
        },
        {
          question: 'Can you also build an online store or booking system?',
          answer: 'We can scope e-commerce and booking features as part of a project. Tell us what you need during a consultation and we will confirm what is realistic.',
        },
        {
          question: 'How do I get a quote?',
          answer: 'Book a free consultation or message us on WhatsApp with a short description of your business and the pages you need.',
        },
      ]}
      related={[
        { label: 'AI Automation', href: '/ai-automation' },
        { label: 'WhatsApp AI Assistant', href: '/whatsapp-ai-assistant-nigeria' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
      ]}
      ctaTitle="Need a website developer in Abuja?"
      ctaSubtitle="Tell us about your business and we will recommend the right approach."
    />
  );
}
