export const siteConfig = {
  name: 'Analytiq Digital',
  legalName: 'Analytiq Digital',
  shortName: 'Analytiq',
  founder: 'Mekan Matthew',
  founderTitle: 'Founder & Lead Digital Transformation Consultant',
  positioning:
    'I help Nigerian businesses and institutions turn data into decisions, automate operations, and ship reliable web & software systems — from Power BI dashboards to custom web apps and inventory solutions.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.analytiq.ng',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@analytiq.ng',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://cal.com/analytiq-digital/15min',
  city: 'Abuja',
  region: 'FCT',
  country: 'Nigeria',
  countryCode: 'NG',
  social: {
    linkedin: 'https://www.linkedin.com/company/analytiq-digital',
    x: 'https://x.com/analytiq_ng',
  },
  nav: [
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const defaultWhatsappMessage =
  "Hi Analytiq Digital, I'd like to talk about a project.";
