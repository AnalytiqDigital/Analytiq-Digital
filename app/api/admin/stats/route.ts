import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { services, portfolioItems, blogPosts, leads, caseStudies, testimonials } from '@/db/schema';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

  return NextResponse.json({
    services: servicesCount.count,
    portfolio: portfolioCount.count,
    caseStudies: caseStudiesCount.count,
    publishedArticles: publishedBlogCount.count,
    newLeads: newLeadsCount.count,
    totalLeads: totalLeadsCount.count,
    pendingTestimonials: pendingTestimonialsCount.count,
  });
}
