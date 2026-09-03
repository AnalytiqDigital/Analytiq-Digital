// import Link from 'next/link';
// import type { PortfolioItem } from '@/lib/portfolio-data';

// export default function PortfolioCard({ item }: { item: PortfolioItem }) {
//   return (
//     <Link
//       href={`/portfolio/${item.slug}`}
//       className="card group flex flex-col justify-between overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
//     >
//       <div>
//         <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-brand-gradient">
//           <span className="font-display text-sm font-semibold text-white/70">{item.category}</span>
//         </div>
//         <span className="eyebrow">{item.category}</span>
//         <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-brand">
//           {item.title}
//         </h3>
//         <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
//       </div>
//       <div className="mt-4 flex flex-wrap gap-1.5">
//         {item.technologies.slice(0, 3).map((tech) => (
//           <span key={tech} className="rounded-full bg-surface-off px-2.5 py-1 text-xs font-medium text-ink/60">
//             {tech}
//           </span>
//         ))}
//       </div>
//     </Link>
//   );
// }
import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioItem } from '@/lib/portfolio-data';

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="card group flex flex-col justify-between overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div>
        {/* ADDED: relative and overflow-hidden classes to make the Next.js Image fill correctly */}
        <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-brand-gradient">
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105" 
            />
          ) : (
            /* Fallback gradient if no image is uploaded */
            <span className="font-display text-sm font-semibold text-white/70">{item.category}</span>
          )}
        </div>
        
        <span className="eyebrow">{item.category}</span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-brand">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.technologies.slice(0, 3).map((tech) => (
          <span key={tech} className="rounded-full bg-surface-off px-2.5 py-1 text-xs font-medium text-ink/60">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}