import { buildMetadata } from '@/lib/seo';
import Section from '@/components/Section';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, personSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'About Mekan Matthew, Founder & Lead Digital Transformation Consultant at Analytiq Digital — Power BI, custom software, and automation for Nigerian businesses.',
  path: '/about',
});

const values = [
  {
    title: 'Diagnose before prescribing',
    description:
      'The right fix is not always the most technically impressive one. Part of every engagement is being honest about whether you need a full custom build, a lighter tool, or sometimes just a process change.',
  },
  {
    title: 'Systems your team actually uses',
    description:
      'A dashboard nobody opens or software your staff quietly route around is a failed project regardless of how well it was built. Adoption is treated as part of the deliverable, not an afterthought.',
  },
  {
    title: 'Clear scope, clear cost',
    description:
      'You get a written scope and price before committing, and honest flags if requirements change along the way — not surprises at final invoice.',
  },
  {
    title: 'Built to be handed over',
    description:
      'Documentation and training are part of every delivery, so your business is not permanently dependent on one consultant to keep the lights on.',
  },
];

const tools = [
  'Power BI',
  'Excel & VBA',
  'SQL',
  'Python',
  'React / Next.js',
  'Node.js',
  'n8n & workflow automation',
  'WordPress',
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[personSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]} />

      <Section tone="brand" className="pb-14 pt-16 sm:pt-20">
        <p className="eyebrow text-accent-light">About</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{siteConfig.founder}</h1>
        <p className="mt-2 text-lg text-white/85">{siteConfig.founderTitle}</p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 aspect-[4/3] w-full max-w-md rounded-2xl bg-surface-off ring-1 ring-slate-200" aria-hidden="true" />
            <div className="space-y-5 leading-relaxed text-ink/80">
              <p>
                I run Analytiq Digital as an independent IT consulting practice based in Abuja, working with Nigerian businesses and institutions on the data, software, and automation problems that quietly cost the most time and money.
              </p>
              <p>
                Most engagements start the same way: a business has grown past what spreadsheets and manual processes can reliably handle, but is not sure whether the fix is a dashboard, a piece of custom software, an automated workflow, or something simpler. My job starts before any tool is chosen — understanding the actual workflow, the actual decision being made, and the actual constraints of the team that has to use whatever gets built.
              </p>
              <p>
                My background spans data analytics and Power BI, full-stack web and software development, and business process automation. That range matters in practice: a lot of &ldquo;software problems&rdquo; are really data problems, and a lot of &ldquo;we need custom software&rdquo; requests are better solved with a focused automation instead. Working across all three means the recommendation fits the problem, not whichever service happens to be on offer.
              </p>
              <p>
                I work directly with clients — no account managers, no handoffs between departments. The person you talk to during the discovery call is the person building and delivering the work.
              </p>
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold text-ink">Tools &amp; technologies</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span key={tool} className="rounded-full border border-brand/20 bg-surface-off px-4 py-2 text-sm font-medium text-brand">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="font-display text-xl font-bold text-ink">How I approach the work</h2>
            <div className="mt-5 space-y-5">
              {values.map((v) => (
                <div key={v.title} className="card">
                  <h3 className="font-display text-base font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{v.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="off">
        <CTA
          title="Have a specific problem in mind?"
          subtitle="Book a free 15-minute consultation and I'll tell you honestly what I think the right approach is."
        />
      </Section>
    </>
  );
}
