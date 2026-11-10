'use client';

import { useState } from 'react';

export default function PayInvoiceButton({ invoiceId }: { invoiceId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/portal/pay/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not start payment. Please try again.');
        setLoading(false);
        return;
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      setError('Could not start payment. Please try again.');
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handlePay} disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? 'Redirecting to Paystack…' : 'Pay now with Paystack'}
      </button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-ink/50">Card, bank transfer and USSD accepted via Paystack.</p>
    </div>
  );
}
