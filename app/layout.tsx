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
    default: titleTemplate('AI, Software, Automation & Data Analytics'),
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.positioning,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder }],
  generator: 'Next.js',
  keywords: [
    'AI automation Nigeria',
    'Power BI consultant Nigeria',
    'software development Abuja',
    'AI WhatsApp assistant Nigeria',
    'business automation Nigeria',
    'web development Abuja',
    'data analytics consultant Nigeria',
    'digital transformation Nigeria',
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
    icon: '/favicon-32.png',
    apple: '/favicon-192.png',
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
