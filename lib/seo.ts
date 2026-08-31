import type { Metadata } from 'next';
import { siteConfig } from './site-config';

interface PageSeoInput {
  title: string;
  description: string;
  path: string; // e.g. '/services/web-development'
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({ title, description, path, image, noIndex }: PageSeoInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}/og-default.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_NG',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function titleTemplate(pageTitle: string) {
  return `${pageTitle} | ${siteConfig.name}`;
}
