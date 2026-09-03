import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { services, portfolioItems, caseStudies, blogPosts, leads, testimonials } from '@/db/schema';
import { Briefcase, FolderKanban, FileText, Newspaper, Inbox, MessageSquareQuote } from 'lucide-react';

async function getStats() {
  const [servicesCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
  const [portfolioCount] = await db.select({ count: sql<number>`count(*)` }).from(portfolioItems);
  const [caseStudiesCount] = await db.select({ count: sql<number>`count(*)` }).from(caseStudies);
  const [publishedBlogCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(sql`${blogPosts.status} = 'published'`);
  const [newLeadsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(sql`${leads.status} = 'New'`);
  const [totalLeadsCount] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [pendingTestimonialsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(testimonials)
    .where(sql`${testimonials.status} = 'pending'`);

  return {
    services: servicesCount.count,
    portfolio: portfolioCount.count,
    caseStudies: caseStudiesCount.count,
    publishedArticles: publishedBlogCount.count,
    newLeads: newLeadsCount.count,
    totalLeads: totalLeadsCount.count,
    pendingTestimonials: pendingTestimonialsCount.count,
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Published Services', value: stats.services, icon: Briefcase, href: '/admin/services' },
    { label: 'Portfolio Projects', value: stats.portfolio, icon: FolderKanban, href: '/admin/portfolio' },
    { label: 'Case Studies', value: stats.caseStudies, icon: FileText, href: '/admin/case-studies' },
    { label: 'Published Articles', value: stats.publishedArticles, icon: Newspaper, href: '/admin/blog' },
    { label: 'New Leads', value: stats.newLeads, icon: Inbox, href: '/admin/leads' },
    { label: 'Pending Testimonials', value: stats.pendingTestimonials, icon: MessageSquareQuote, href: '/admin/testimonials' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink/60">A quick look at what&apos;s on the website right now.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={18} />
                </span>
                <span className="font-display text-3xl font-bold text-ink">{card.value}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-ink/70">{card.label}</p>
            </a>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-ink/60">
          Total leads collected: <span className="font-semibold text-ink">{stats.totalLeads}</span>. Manage them under{' '}
          <a href="/admin/leads" className="font-semibold text-brand hover:underline">Leads</a>.
        </p>
      </div>
    </div>
  );
}
