import Link from 'next/link';
import { whatsappLink, defaultWhatsAppMessage } from '@/lib/site-config';

interface CTAProps {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  showWhatsapp?: boolean;
}

export default function CTA({
  title,
  subtitle,
  primaryLabel = 'Book a Free Consultation',
  primaryHref = '/book-a-consultation',
  showWhatsapp = true,
}: CTAProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-gradient px-6 py-12 text-center text-white sm:px-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30" aria-hidden="true" />
      <div className="relative">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/80">{subtitle}</p>}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          {showWhatsApp && (
            <a
              href={whatsappLink(defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp Us
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
