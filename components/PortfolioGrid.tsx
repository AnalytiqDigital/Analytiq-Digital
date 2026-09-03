'use client';

import { useState } from 'react';
import PortfolioCard from '@/components/PortfolioCard';
import { portfolioCategories, type PortfolioItem, type PortfolioCategory } from '@/lib/portfolio-data';

const ALL = 'All' as const;

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<PortfolioCategory | typeof ALL>(ALL);

  const filtered = active === ALL ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter portfolio by category">
        {[ALL, ...portfolioCategories].map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            onClick={() => setActive(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === category
                ? 'bg-brand-gradient text-white shadow-soft'
                : 'border border-slate-200 bg-white text-ink/70 hover:border-brand/40 hover:text-brand'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink/60">No projects in this category yet.</p>
      )}
    </div>
  );
}
