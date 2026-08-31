interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ({ items, title = 'Frequently asked questions' }: { items: FAQItem[]; title?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item, i) => (
          <details key={i} className="group p-5 open:bg-surface-off/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-['']">
              {item.question}
              <span className="shrink-0 text-accent-teal transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
