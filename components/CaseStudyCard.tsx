import Link from 'next/link';
import type { CaseStudy } from '@/lib/case-studies-data';

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="card flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div>
        <span className="eyebrow">{caseStudy.industry}</span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
          {caseStudy.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{caseStudy.summary}</p>
      </div>
      <div className="mt-6 text-sm font-semibold text-accent-teal">Read the case study &rarr;</div>
    </Link>
  );
}
