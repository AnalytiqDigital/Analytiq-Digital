import Link from 'next/link';
import { whatsappLink, defaultWhatsappMessage } from '@/lib/site-config';

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
  primaryLabel = 'Book a Free 15-Minute Consultation',
  primaryHref = '/contact',
  showWhatsapp = true,
}: CTAProps) {
  return (
    <div className="rounded-2xl bg-brand px-6 py-12 text-center text-white sm:px-12">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/80">{subtitle}</p>}
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href={primaryHref} className="btn-primary">
          {primaryLabel}
        </Link>
        {showWhatsapp && (
          <a
            href={whatsappLink(defaultWhatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            WhatsApp Me
          </a>
        )}
      </div>
    </div>
  );
}
