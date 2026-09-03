import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'off' | 'brand';
  id?: string;
}

export default function Section({ children, className = '', tone = 'default', id }: SectionProps) {
  const toneClass =
    tone === 'off' ? 'bg-surface-off' : tone === 'brand' ? 'bg-brand-gradient text-white' : 'bg-surface';

  return (
    <section id={id} className={`relative overflow-hidden ${toneClass} py-16 sm:py-20 ${className}`}>
      {tone === 'brand' && (
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30"
          aria-hidden="true"
        />
      )}
      <div className="container-page relative">{children}</div>
    </section>
  );
}
