import { caseStudies } from '@/lib/case-studies-data';
import { getServiceBySlug, services } from '@/lib/services-data';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

/**
 * llms.txt — plain-language summary of AnalytIQ Digital for AI search
 * engines and assistants (ChatGPT Search, Perplexity, Claude, Gemini).
 * Convention: https://llmstxt.org/
 */
export function GET() {
  const base = siteConfig.url;

  const serviceLines = services.map(
    (s) => `- [${s.name}](${base}/services/${s.slug}): ${s.shortDescription} Pricing from ${s.fromPrice}.`,
  );

  const caseStudyLines = caseStudies.map((cs) => {
    const service = getServiceBySlug(cs.serviceSlug);
    return `- [${cs.title}](${base}/case-studies/${cs.slug})${service ? ` (${service.name} case study)` : ''}.`;
  });

  const body = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.positioning}`,
    '',
    `- Location: ${siteConfig.address}`,
    `- Contact page: ${base}/contact`,
    `- Email: ${siteConfig.email}`,
    `- WhatsApp: https://wa.me/${siteConfig.whatsappNumber}`,
    `- Free 15-minute consultation: ${siteConfig.bookingUrl}`,
    '',
    '## Services',
    '',
    'Custom software, AI automation, Power BI dashboards, websites, WhatsApp AI assistants, and vendor-neutral digital consulting for Nigerian businesses.',
    '',
    ...serviceLines,
    '',
    '## Key pages',
    '',
    `- [AI Automation](${base}/ai-automation): AI agents, WhatsApp assistants, and workflow automation that save teams hours weekly.`,
    `- [Data Analytics & Power BI](${base}/data-analytics): dashboards and automated reporting with one shared source of truth.`,
    `- [Website Development in Abuja](${base}/website-development-abuja): conversion-focused websites built for Nigerian customers.`,
    `- [WhatsApp AI Assistant Nigeria](${base}/whatsapp-ai-assistant-nigeria): AI customer service directly on WhatsApp.`,
    `- [Solutions](${base}/solutions): industry-shaped solutions built on the AnalytIQ stack.`,
    `- [Pricing](${base}/pricing): starting prices in Naira for every service.`,
    `- [About](${base}/about): founder, approach, and company background.`,
    `- [AnalytIQ ERP](https://app.analytiq.ng): business management, POS, inventory, and accounting for Nigerian businesses.`,
    '',
    '## Case studies',
    '',
    ...caseStudyLines,
    '',
    '## Contact',
    '',
    `Start a project at ${base}/contact or message on WhatsApp. Every engagement starts with a free consultation and a written scope with clear pricing before any commitment.`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
