'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    const track = async () => {
      const url = new URL(window.location.href);
      const referrer = document.referrer || null;
      const campaign = url.searchParams.get('utm_campaign');
      const source = url.searchParams.get('utm_source') || undefined;

      try {
        await fetch('/api/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer,
            source,
            campaign,
            userAgent: navigator.userAgent,
            ipAddress: null,
          }),
        });
      } catch (error) {
        console.error('Visitor tracking failed:', error);
      }
    };

    track();
  }, []);

  return null;
}
