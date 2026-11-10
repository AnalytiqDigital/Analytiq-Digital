import Link from 'next/link';
import { Globe, Cpu, BarChart3, Code2, MessageCircle, Compass, type LucideIcon } from 'lucide-react';
import type { ServiceData } from '@/lib/services-data';
import Price from '@/components/Price';

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  cpu: Cpu,
  'bar-chart': BarChart3,
  code: Code2,
  'message-circle': MessageCircle,
  compass: Compass,
};

export default function ServiceCard({ service }: { service: ServiceData }) {
  const Icon = iconMap[service.icon] || Compass;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group relative flex flex-col justify-between overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.shortDescription}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-semibold text-brand">
          <Price amountNGN={service.fromPriceNGN} />
        </span>
        <span className="font-semibold text-accent-teal group-hover:underline">Learn more &rarr;</span>
      </div>
    </Link>
  );
}
