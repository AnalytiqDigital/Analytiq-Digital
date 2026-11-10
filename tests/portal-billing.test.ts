import { describe, it, expect } from 'vitest';
import {
  groupOpenBalancesByCurrency,
  isDisplayOverdue,
} from '@/lib/portal-resources';

describe('per-currency outstanding totals', () => {
  it('groups open balances by currency instead of summing across currencies', () => {
    const totals = groupOpenBalancesByCurrency([
      { status: 'sent', currency: 'NGN', amount: 450000, amountPaid: 0 },
      { status: 'partial', currency: 'NGN', amount: 200000, amountPaid: 50000 },
      { status: 'sent', currency: 'USD', amount: 2500, amountPaid: 0 },
      // Closed / settled states never contribute
      { status: 'paid', currency: 'NGN', amount: 100000, amountPaid: 100000 },
      { status: 'draft', currency: 'NGN', amount: 999999, amountPaid: 0 },
      { status: 'cancelled', currency: 'USD', amount: 500, amountPaid: 0 },
    ]);
    expect(totals.get('NGN')).toBe(600000);
    expect(totals.get('USD')).toBe(2500);
    expect(totals.size).toBe(2);
  });

  it('ignores fully-paid balances and normalises currency codes', () => {
    const totals = groupOpenBalancesByCurrency([
      { status: 'sent', currency: 'ngn', amount: 1000, amountPaid: 1000 },
      { status: 'sent', currency: 'usd', amount: 100, amountPaid: 0 },
    ]);
    expect(totals.has('NGN')).toBe(false);
    expect(totals.get('USD')).toBe(100);
  });
});

describe('display-only overdue', () => {
  const past = new Date(Date.now() - 86400000);
  const future = new Date(Date.now() + 86400000);

  it('flags sent/partial invoices past their due date', () => {
    expect(isDisplayOverdue({ status: 'sent', dueDate: past })).toBe(true);
    expect(isDisplayOverdue({ status: 'partial', dueDate: past })).toBe(true);
  });

  it('does not flag future due dates, missing dates, or closed states', () => {
    expect(isDisplayOverdue({ status: 'sent', dueDate: future })).toBe(false);
    expect(isDisplayOverdue({ status: 'sent', dueDate: null })).toBe(false);
    expect(isDisplayOverdue({ status: 'paid', dueDate: past })).toBe(false);
    expect(isDisplayOverdue({ status: 'draft', dueDate: past })).toBe(false);
    expect(isDisplayOverdue({ status: 'overdue', dueDate: past })).toBe(false);
  });
});
