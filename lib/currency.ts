// Multi-currency pricing support: NGN (base) with USD and GHS equivalents.
//
// Rates are approximate mid-market equivalents (Nov 2026) used to display
// indicative starting prices — exact quotes are always scoped per project.
// Update these constants periodically as rates move.
//
// Sources: CBN indicative / NAFEM window ~₦1,450–1,550 per USD;
// mid-market aggregators (Wise, XE) ~1 GHS = ₦120–130.

export type CurrencyCode = 'NGN' | 'GHS' | 'USD';

export const NGN_PER_USD = 1500;
export const NGN_PER_GHS = 125;

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'NGN', label: 'Naira', symbol: '₦' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'GHS', label: 'Ghana Cedi', symbol: 'GH₵' },
];

export function convertFromNGN(amountNGN: number, currency: CurrencyCode): number {
  switch (currency) {
    case 'NGN':
      return amountNGN;
    case 'USD':
      return Math.round(amountNGN / NGN_PER_USD);
    case 'GHS':
      return Math.round(amountNGN / NGN_PER_GHS);
  }
}

const formatters: Record<CurrencyCode, Intl.NumberFormat> = {
  NGN: new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }),
  GHS: new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }),
};

/** Format an NGN base amount in the requested currency. */
export function formatPrice(amountNGN: number, currency: CurrencyCode = 'NGN'): string {
  return formatters[currency].format(convertFromNGN(amountNGN, currency));
}

/** All three display strings for a base NGN amount. */
export function priceEquivalents(amountNGN: number): Record<CurrencyCode, string> {
  return {
    NGN: formatPrice(amountNGN, 'NGN'),
    USD: formatPrice(amountNGN, 'USD'),
    GHS: formatPrice(amountNGN, 'GHS'),
  };
}
