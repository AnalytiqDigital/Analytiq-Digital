import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'off' | 'brand';
  id?: string;
}

export default function Section({ children, className = '', tone = 'default', id }: SectionProps) {
  const toneClass =
    tone === 'off' ? 'bg-surface-off' : tone === 'brand' ? 'bg-brand text-white' : 'bg-surface';

  return (
    <section id={id} className={`${toneClass} py-16 sm:py-20 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
