import { describe, it, expect } from 'vitest';
import {
  buildInvoiceNumber,
  formatPortalAmount,
  isPaystackCurrency,
} from '@/db/schema-portal';

describe('portal invoicing helpers', () => {
  it('recognises Paystack-chargeable currencies and rejects the rest', () => {
    expect(isPaystackCurrency('NGN')).toBe(true);
    expect(isPaystackCurrency('USD')).toBe(true);
    expect(isPaystackCurrency('GHS')).toBe(true);
    expect(isPaystackCurrency('ZAR')).toBe(true);
    expect(isPaystackCurrency('KES')).toBe(true);
    expect(isPaystackCurrency('RWF')).toBe(true);
    expect(isPaystackCurrency('ngn')).toBe(true); // case-insensitive
    expect(isPaystackCurrency('EUR')).toBe(false);
    expect(isPaystackCurrency('GBP')).toBe(false);
    expect(isPaystackCurrency('XXX')).toBe(false);
  });

  it('builds unique-looking invoice numbers for the current year', () => {
    const year = new Date().getFullYear();
    expect(buildInvoiceNumber(1)).toBe(`AQ-${year}-0001`);
    expect(buildInvoiceNumber(42)).toBe(`AQ-${year}-0042`);
  });

  it('formats major-unit amounts with their currency', () => {
    expect(formatPortalAmount(450000, 'NGN')).toContain('450,000');
    expect(formatPortalAmount(2500, 'USD')).toContain('2,500');
    // Unknown codes fall back to a CODE prefix rather than throwing
    expect(formatPortalAmount(1000, 'XXX')).toBe('XXX 1,000');
  });
});
