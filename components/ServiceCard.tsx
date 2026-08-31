import Link from 'next/link';
import type { ServiceData } from '@/lib/services-data';

export default function ServiceCard({ service }: { service: ServiceData }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div>
        <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand">
          {service.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.shortDescription}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-semibold text-brand">From {service.fromPrice}</span>
        <span className="font-semibold text-accent-teal group-hover:underline">
          Learn more &rarr;
        </span>
      </div>
    </Link>
  );
}
