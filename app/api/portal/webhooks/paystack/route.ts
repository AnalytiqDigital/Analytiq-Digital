import { NextResponse } from 'next/server';
import { isValidPaystackSignature, recordSuccessfulPortalPayment, verifyPaystackTransaction } from '@/lib/paystack';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  if (!isValidPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; status?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // charge.success is the event that matters; verify with Paystack before trusting it.
  if (event.event === 'charge.success' && event.data?.reference) {
    try {
      const verified = await verifyPaystackTransaction(event.data.reference);
      if (verified.status === 'success') {
        await recordSuccessfulPortalPayment({
          reference: verified.reference,
          channel: verified.channel,
          rawPayload: rawBody,
        });
      }
    } catch (err) {
      console.error('Paystack webhook finalize error:', err);
      // Return 500 so Paystack retries the webhook.
      return NextResponse.json({ error: 'Failed to finalize payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
