import { buildMetadata } from '@/lib/seo';
import LocalLanding from '@/components/LocalLanding';

const description =
  'WhatsApp AI assistant and n8n automation for Nigerian businesses. AnalytIQ Digital builds assistants that answer FAQs, capture leads and hand over to your team, using the WhatsApp Business Platform.';

export const metadata = buildMetadata({
  title: 'WhatsApp AI Assistant & n8n Automation in Nigeria',
  description,
  path: '/whatsapp-ai-assistant-nigeria',
});

export default function WhatsappAiAssistantNigeriaPage() {
  return (
    <LocalLanding
      path="/whatsapp-ai-assistant-nigeria"
      breadcrumbName="WhatsApp AI Assistant in Nigeria"
      schemaName="WhatsApp AI Assistant and n8n Automation"
      metaDescription={description}
      eyebrow="WhatsApp AI Assistant & n8n Automation"
      h1="WhatsApp AI assistant and n8n automation for Nigerian businesses"
      intro="Many customers already message your business on WhatsApp. We build an AI assistant on the WhatsApp Business Platform that answers routine questions, captures enquiries and passes conversations to your team when a human is needed, with workflows built on n8n behind it."
      primaryCta={{ label: 'Book a Free Consultation', href: '/book-a-consultation' }}
      secondaryCta={{ label: 'See Service Details', href: '/services/ai-whatsapp-assistant' }}
      blocks={[
        {
          heading: 'What the assistant can do',
          body: 'The assistant is written around your real products, services and tone, not a generic template.',
          points: [
            'Answer common customer FAQs',
            'Capture names, contact details and enquiries',
            'Route the conversation to a human on your team',
            'Send your team an alert when someone needs help',
          ],
        },
        {
          heading: 'n8n workflow automation',
          body: 'n8n connects WhatsApp to the tools you already use, such as spreadsheets, email and your CRM, so enquiries are logged and routed without manual copying.',
        },
        {
          heading: 'WhatsApp Business Platform requirements',
          body: 'A reliable assistant uses the official WhatsApp Business Platform, which needs a Meta business account and a business phone number. Messages sent outside the 24-hour customer-service window must use approved templates. We help you set this up as part of the project.',
        },
        {
          heading: 'Knowledge, privacy and failure handling',
          body: 'The assistant only answers from information you approve. If it is unsure, or something fails, it hands over to a person instead of guessing. We discuss how customer data is stored and who can access it before launch.',
        },
      ]}
      steps={[
        { title: 'Conversation mapping', description: 'We map the questions and flows your team handles most often on WhatsApp.' },
        { title: 'Build and test', description: 'We build the assistant and workflows, then test with realistic customer messages, including handoff cases.' },
        { title: 'Launch and support', description: 'We connect your business number, train your team to monitor the assistant, and agree support scope.' },
      ]}
      faqs={[
        {
          question: 'Do I need the official WhatsApp Business API?',
          answer: 'For a reliable and scalable assistant, yes. We help set it up rather than relying on unofficial workarounds that can put your number at risk.',
        },
        {
          question: 'Will the assistant replace my team?',
          answer: 'No. It handles routine questions and passes anything else to a person, so your team can focus on conversations that need them.',
        },
        {
          question: 'Can the assistant take orders or bookings?',
          answer: 'Straightforward order and booking flows can be scoped. More complex flows, such as inventory-checked orders, are discussed during consultation.',
        },
        {
          question: 'Which tools can it connect to?',
          answer: 'Through n8n we can connect many common tools such as Google Sheets, email and CRMs. We confirm exactly which integrations are possible for your setup during scoping.',
        },
      ]}
      related={[
        { label: 'AI Automation', href: '/ai-automation' },
        { label: 'Website Development in Abuja', href: '/website-development-abuja' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Contact', href: '/contact' },
      ]}
      ctaTitle="Want a WhatsApp assistant for your business?"
      ctaSubtitle="Book a consultation and we will map the first automation worth building."
    />
  );
}
