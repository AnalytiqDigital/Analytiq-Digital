import 'dotenv/config';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { db, dbFilePath } from './index';
import { users, services, portfolioItems, caseStudies, blogPosts, siteSettings } from './schema';
import { services as servicesData } from '../lib/services-data';
import { portfolioItems as portfolioData } from '../lib/portfolio-data';
import { caseStudies as caseStudiesData } from '../lib/case-studies-data';
import { blogPosts as blogData } from '../lib/blog-data';
import { blogDataBlocksToTipTapDoc, renderTipTapDocToHtml, tipTapDocToText } from '../lib/blog-render';
import { siteConfig } from '../lib/site-config';

async function seed() {
  console.log('Seeding database...');
  console.log(`  Database file: ${dbFilePath}`);

  // --- Admin user ---------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@analytiq.ng';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ReplaceThisPasswordBeforeDeploying!';

  const existingUser = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, adminEmail) });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      email: adminEmail,
      passwordHash,
      name: 'AnalytIQ Admin',
      role: 'admin',
    });
    console.log(`Created admin user: ${adminEmail}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`  Using default password "${adminPassword}" — set ADMIN_PASSWORD in .env.local before deploying and re-seed.`);
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // --- Site settings (singleton) ------------------------------------------
  const existingSettings = await db.query.siteSettings.findFirst();
  if (!existingSettings) {
    await db.insert(siteSettings).values({
      companyName: siteConfig.name,
      tagline: siteConfig.tagline,
      logoUrl: '/logo.png',
      email: siteConfig.email,
      address: siteConfig.address,
      socialLinks: siteConfig.social,
      seoDefaultTitle: 'AnalytIQ Digital | AI, Software, Automation & Data Analytics',
      seoDefaultDescription: siteConfig.positioning,
    });
    console.log('Created default site settings.');
  }

  // --- Services ------------------------------------------------------------
  for (const [i, s] of servicesData.entries()) {
    const existing = await db.query.services.findFirst({ where: (t, { eq }) => eq(t.slug, s.slug) });
    if (existing) continue;
    await db.insert(services).values({
      slug: s.slug,
      name: s.name,
      icon: s.icon,
      shortDescription: s.shortDescription,
      description: s.problem + '\n\n' + s.solution,
      benefits: s.benefits,
      fromPrice: s.fromPrice,
      published: true,
      sortOrder: i,
    });
  }
  console.log(`Seeded ${servicesData.length} services.`);

  // --- Portfolio -------------------------------------------------------------
  for (const [i, p] of portfolioData.entries()) {
    const existing = await db.query.portfolioItems.findFirst({ where: (t, { eq }) => eq(t.slug, p.slug) });
    if (existing) continue;
    await db.insert(portfolioItems).values({
      slug: p.slug,
      title: p.title,
      category: p.category,
      description: p.description,
      technologies: p.technologies,
      projectUrl: p.projectUrl,
      published: true,
      sortOrder: i,
    });
  }
  console.log(`Seeded ${portfolioData.length} portfolio items.`);

  // --- Case studies ----------------------------------------------------------
  for (const c of caseStudiesData) {
    const existing = await db.query.caseStudies.findFirst({ where: (t, { eq }) => eq(t.slug, c.slug) });
    if (existing) continue;
    await db.insert(caseStudies).values({
      slug: c.slug,
      title: c.title,
      client: c.client,
      industry: c.industry,
      serviceSlug: c.serviceSlug,
      summary: c.summary,
      challenge: c.challenge,
      approach: c.approach,
      solution: c.solution,
      results: c.results,
      tech: c.tech,
      published: true,
    });
  }
  console.log(`Seeded ${caseStudiesData.length} case studies.`);

  // --- Blog posts ------------------------------------------------------------
  for (const b of blogData) {
    const existing = await db.query.blogPosts.findFirst({ where: (t, { eq }) => eq(t.slug, b.slug) });
    if (existing) continue;
    const content = b.content.map((block) => [block.heading ? `## ${block.heading}` : '', ...block.paragraphs].filter(Boolean).join('\n\n')).join('\n\n');
    const doc = blogDataBlocksToTipTapDoc(b.content);
    await db.insert(blogPosts).values({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: tipTapDocToText(doc) || content,
      contentJson: doc,
      contentHtml: renderTipTapDocToHtml(doc),
      category: 'Insights',
      status: 'published',
      publishedAt: new Date(b.datePublished),
      authorName: siteConfig.founder,
      seoTitle: b.title,
      seoDescription: b.metaDescription,
    });
  }
  console.log(`Seeded ${blogData.length} blog posts.`);

  console.log('Seed complete.');
}

seed()
  .catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    if (/no such table/i.test(message)) {
      console.error('\nSeed failed: the database has no tables yet.\n');
      console.error('This means "npm run db:push" either was not run, or did not point at');
      console.error('the same database file this seed script is using. Check the');
      console.error('"Database file:" path printed above this error, then run:\n');
      console.error('  npm run db:push\n  npm run db:seed\n');
    } else {
      console.error('Seed failed:', err);
    }
    process.exit(1);
  })
  .finally(() => process.exit(0));
