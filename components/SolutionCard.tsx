import {
  CreditCard,
  Package,
  Users,
  BarChart3,
  Utensils,
  GraduationCap,
  LayoutGrid,
  type LucideIcon,
  Check,
} from 'lucide-react';
import type { Solution } from '@/lib/solutions-data';

const iconMap: Record<string, LucideIcon> = {
  'credit-card': CreditCard,
  package: Package,
  users: Users,
  'bar-chart': BarChart3,
  utensils: Utensils,
  'graduation-cap': GraduationCap,
  'layout-grid': LayoutGrid,
};

export default function SolutionCard({ solution }: { solution: Solution }) {
  const Icon = iconMap[solution.icon] || LayoutGrid;

  return (
    <div className="card flex flex-col">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{solution.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{solution.description}</p>
      <ul className="mt-4 space-y-2">
        {solution.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-ink/60">
            <Check size={14} className="mt-0.5 shrink-0 text-accent-teal" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
