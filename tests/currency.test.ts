import { describe, it, expect } from 'vitest';
import { convertFromNGN, formatPrice, priceEquivalents } from '@/lib/currency';

describe('multi-currency pricing', () => {
  it('converts base NGN amounts to USD and GHS', () => {
    expect(convertFromNGN(450000, 'NGN')).toBe(450000);
    expect(convertFromNGN(450000, 'USD')).toBe(300);
    expect(convertFromNGN(450000, 'GHS')).toBe(3600);
    expect(convertFromNGN(300000, 'USD')).toBe(200);
    expect(convertFromNGN(300000, 'GHS')).toBe(2400);
    expect(convertFromNGN(350000, 'USD')).toBe(233);
    expect(convertFromNGN(900000, 'USD')).toBe(600);
    expect(convertFromNGN(400000, 'USD')).toBe(267);
    expect(convertFromNGN(200000, 'USD')).toBe(133);
    expect(convertFromNGN(200000, 'GHS')).toBe(1600);
  });

  it('formats each currency with grouped digits', () => {
    expect(formatPrice(450000, 'NGN')).toContain('450,000');
    expect(formatPrice(450000, 'USD')).toContain('300');
    expect(formatPrice(450000, 'GHS')).toContain('3,600');
  });

  it('returns all three equivalents together', () => {
    const eq = priceEquivalents(300000);
    expect(eq.NGN).toContain('300,000');
    expect(eq.USD).toContain('200');
    expect(eq.GHS).toContain('2,400');
  });
});
