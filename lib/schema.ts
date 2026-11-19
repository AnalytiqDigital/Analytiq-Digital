import { siteConfig } from './site-config';
import { services } from './services-data';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: `+${siteConfig.whatsappNumber}`,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/logo.png`,
    priceRange: '₦₦',
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
      jobTitle: siteConfig.founderTitle,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '20 Iko Ibrahim Way, Navy Estate, Karshi',
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      postalCode: '900110',
      addressCountry: siteConfig.countryCode,
    },
    areaServed: [
      { '@type': 'Country', name: siteConfig.country },
      {
        '@type': 'City',
        name: siteConfig.city,
        containedInPlace: { '@type': 'AdministrativeArea', name: siteConfig.region },
      },
    ],
    description: siteConfig.positioning,
    knowsAbout: [
      'Website development',
      'Custom software development',
      'AI workflow automation',
      'AI WhatsApp assistants',
      'Power BI dashboards',
      'Data analytics',
      'Digital transformation consulting',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${siteConfig.name} services`,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.shortDescription,
          url: `${siteConfig.url}/services/${s.slug}`,
        },
      })),
    },
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
  fromPriceNGN,
  faqPairs,
}: {
  name: string;
  description: string;
  path: string;
  fromPriceNGN?: number;
  /** Answer-first Q&A rendered on the page — doubled as speakable content for AI engines. */
  faqPairs?: { question: string; answer: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    provider: {
      '@id': `${siteConfig.url}/#organization`,
      '@type': 'ProfessionalService',
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: `+${siteConfig.whatsappNumber}`,
    },
    areaServed: ['Nigeria', 'Abuja'],
    url: `${siteConfig.url}${path}`,
    ...(faqPairs && faqPairs.length > 0
      ? {
          mainEntity: faqPairs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : {}),
    ...(typeof fromPriceNGN === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: fromPriceNGN,
            availability: 'https://schema.org/InStock',
            url: `${siteConfig.url}${path}`,
          },
        }
      : {}),
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
