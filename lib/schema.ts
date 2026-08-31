import { siteConfig } from './site-config';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
      jobTitle: siteConfig.founderTitle,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.countryCode,
    },
    areaServed: ['Nigeria', 'Abuja', 'FCT'],
    description: siteConfig.positioning,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.x],
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#founder`,
    name: siteConfig.founder,
    jobTitle: siteConfig.founderTitle,
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    url: `${siteConfig.url}/about`,
    sameAs: [siteConfig.social.linkedin, siteConfig.social.x],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { '@id': `${siteConfig.url}/#organization` },
  };
}

export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: ['Nigeria', 'Abuja'],
    url: `${siteConfig.url}${path}`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema({
  title,
  description,
  path,
  datePublished,
  image,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    author: { '@id': `${siteConfig.url}/#founder` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    image: image ? [image] : undefined,
    mainEntityOfPage: `${siteConfig.url}${path}`,
  };
}
