export interface VisitEvent {
  page: string;
  referrer?: string | null;
  source?: string | null;
  campaign?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface FollowUpInput {
  name?: string;
  serviceInterest?: string | null;
  page?: string | null;
  email?: string | null;
}

export function formatVisitNotification(event: VisitEvent): string {
  const page = event.page || 'Unknown page';
  const source = event.source || 'direct';
  const campaign = event.campaign || 'general';

  let referrer = 'direct';
  if (event.referrer) {
    try {
      referrer = new URL(event.referrer).hostname.replace(/^www\./, '');
    } catch {
      referrer = event.referrer;
    }
  }

  return `New website visit: ${page} | source: ${source} | referrer: ${referrer} | campaign: ${campaign}`;
}

export function buildFollowUpMessage(input: FollowUpInput): string {
  const name = input.name?.trim() || 'there';
  const service = input.serviceInterest?.trim() || 'our digital growth services';
  const page = input.page || '/services';

  return `Hi ${name}, thanks for visiting AnalytIQ Digital. I noticed you looked at ${page} and may be interested in ${service}. We help businesses grow with websites, automation, data dashboards, and AI-powered lead generation. If you want, I can recommend the best next step for your business.`;
}

export function buildWhatsAppFollowUpMessage(input: FollowUpInput): string {
  const name = input.name?.trim() || 'there';
  const service = input.serviceInterest?.trim() || 'our digital growth services';

  return `Hi ${name}, thanks for visiting AnalytIQ Digital. I saw your interest in ${service}. We help businesses grow with website design, automation, AI workflows, and analytics. If you'd like, I can suggest the best next step for your business. Chat with us on WhatsApp to get started.`;
}

export function buildRetargetingAudienceSetup(input: { websiteName?: string; audienceName?: string }) {
  const websiteName = input.websiteName || 'AnalytIQ Digital';
  const audienceName = input.audienceName || 'Website Visitors';

  return {
    meta: `Create a Meta Custom Audience named "${audienceName}" using the ${websiteName} website pixel. Include all visitors who viewed key pages such as pricing, services, case studies, and contact. Exclude people who already converted, and set ad creatives to focus on lead generation, conversion, and offer-based retargeting.`,
    google: `Create a Google Ads remarketing audience named "${audienceName}" based on all website visitors to ${websiteName}. Segment by service page views, pricing page visits, and contact/form completion. Use search and display remarketing to show conversion-focused creatives to users who did not complete a purchase or enquiry.`,
  };
}

export function buildLeadSummaryFromVisit(event: VisitEvent) {
  return {
    page: event.page,
    source: event.source || 'direct',
    campaign: event.campaign || 'general',
    referrer: event.referrer || null,
  };
}
