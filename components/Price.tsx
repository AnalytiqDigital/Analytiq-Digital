import { priceEquivalents } from '@/lib/currency';

interface PriceProps {
  amountNGN: number;
  /** Compact (card/hero) vs. full sentence (CTA subtitles) rendering */
  variant?: 'short' | 'sentence';
  className?: string;
}

/**
 * Renders an NGN base price with its USD and GHS equivalents.
 * Server-rendered so all three figures are in the HTML (SEO-friendly,
 * no client state needed on a static marketing site).
 */
export default function Price({ amountNGN, variant = 'short', className }: PriceProps) {
  const { NGN, USD, GHS } = priceEquivalents(amountNGN);

  if (variant === 'sentence') {
    return (
      <span className={className}>
        {NGN} (approx. {USD} / {GHS})
      </span>
    );
  }

  return (
    <span className={className}>
      From {NGN}
      <span className="mt-1 block text-sm font-normal opacity-70">
        ≈ {USD} · {GHS}
      </span>
    </span>
  );
}
