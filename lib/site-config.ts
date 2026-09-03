export const siteConfig = {
  name: 'AnalytIQ Digital',
  legalName: 'AnalytIQ Digital',
  shortName: 'AnalytIQ',
  tagline: 'Where Data Meets Intelligence',
  founder: 'Mekan Matthew',
  founderTitle: 'Founder & Lead Digital Transformation Consultant',
  positioning:
    'AnalytIQ Digital builds websites, custom software, AI automation, Power BI dashboards and intelligent digital solutions that help businesses work smarter and grow.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.analytiq.ng',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@analytiq.ng',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://cal.com/analytiq-digital/15min',
  address: '20 Iko Ibrahim Way, Navy Estate, Karshi, Abuja, FCT, Nigeria',
  city: 'Abuja',
  region: 'FCT',
  country: 'Nigeria',
  countryCode: 'NG',
  googleReviewsUrl:
    'https://www.google.com/search?sca_esv=f7ab54955f81add6&sxsrf=APpeQnta8kX8X1OGDUb1dTY2JWCAWHOXUQ%3A1788120130282&q=AnalytIQ%20Digital&stick=H4sIAAAAAAAAAONgU1I1qDA0MEk1SDMyTzUzMUhJSTO0MqgwTjWxNDIzS7JISUpJtUw1X8Qq4JiXmFNZ4hmo4JKZnlmSmAMAzXBg4jwAAAA&mat=CcVunrA0vD14&ved=2ahUKEwiHirnJksmWAxVWT0EAHTYMJoMQrMcEegQIFxAC',
  social: {
    linkedin: 'https://www.linkedin.com/company/analytiq-digital',
    x: 'https://x.com/analytiq_ng',
  },
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const defaultWhatsappMessage =
  "Hi AnalytIQ Digital, I'd like to talk about a project.";
