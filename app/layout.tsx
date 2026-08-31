import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, personSchema, websiteSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site-config';
import { titleTemplate } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: titleTemplate('IT Consulting, Power BI & Custom Software for Nigerian Businesses'),
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.positioning,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder }],
  generator: 'Next.js',
  keywords: [
    'Power BI consultant Nigeria',
    'software development Abuja',
    'business automation Nigeria',
    'inventory management system Nigeria',
    'web development Abuja',
    'data analytics consultant Nigeria',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="flex min-h-screen flex-col font-sans">
        <JsonLd data={[organizationSchema(), personSchema(), websiteSchema()]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
