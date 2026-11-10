'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Continuous camera-move page transitions.
 * Re-triggers a slow settle (scale + rise + de-blur) on every route
 * change so navigation feels like one continuous move, not a cut.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
