# Analytiq Digital — Website

Production-ready marketing & lead-gen website for **Analytiq Digital**
(analytiq.ng), built with Next.js 15 (App Router) + TypeScript + Tailwind CSS.

## Tech stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS (design tokens in `tailwind.config.ts`)
- Native Next.js Metadata API for SEO (titles, descriptions, OG/Twitter cards)
- JSON-LD structured data on every relevant page (`lib/schema.ts`)
- Dynamic `sitemap.xml` and `robots.txt` (`app/sitemap.ts`, `app/robots.ts`)
- Contact form via a React Server Action with a honeypot field and a basic
  in-memory rate-limit stub (`app/contact/actions.ts`)
- `next/image` for optimised images (WebP/AVIF)
- Deploy target: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

See `.env.example` for the full list. At minimum, set before deploying:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata, sitemap, and JSON-LD. Must be `https://www.analytiq.ng` in production. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email shown in the footer, contact page, and mailto links. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only (e.g. `2348012345678`), used for the floating WhatsApp button and CTAs. |
| `NEXT_PUBLIC_BOOKING_URL` | Cal.com / Calendly link used by the "Book a Free 15-Minute Consultation" button on the contact page. |
| `CONTACT_RECEIVING_EMAIL` | Where contact form submissions should be forwarded once email delivery is wired up (see below). |
| `RESEND_API_KEY` | Optional — only needed once you wire up real email delivery for the contact form. |
| `NEXT_PUBLIC_GA_ID` | Optional analytics ID. |

## Wiring up the contact form to real email delivery

`app/contact/actions.ts` currently validates the form, runs a honeypot check,
applies a simple in-memory rate limit, and logs the submission to the server
console. It does **not** yet send an email — this is left as a clear
integration point rather than guessing a provider. To finish it:

1. Pick a transactional email provider (Resend, Postmark, SendGrid, etc.).
2. Add its API key to your environment variables.
3. Replace the `console.log(...)` block in `submitContactForm` with an API
   call to send the submission to `CONTACT_RECEIVING_EMAIL`.
4. For production, also replace the in-memory rate limiter with a durable
   store (e.g. Upstash Redis) since the in-memory version resets on every
   cold start and isn't shared across serverless instances.

## Fonts

The site currently uses a system-first font stack (`-apple-system`, Segoe UI,
Roboto, etc.) defined in `tailwind.config.ts` — fast, zero network requests
at build time, and matches the brief's "system or one elegant pair"
guidance. If you'd like to switch to a specific webfont (e.g. Inter via
Google Fonts):

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// then add className={inter.variable} to the <html> tag
```

...and update `fontFamily.sans` / `fontFamily.display` in
`tailwind.config.ts` to lead with `var(--font-inter)`. Note this requires
network access to `fonts.googleapis.com` at build time.

## Deploying to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Import the repo into Vercel.
3. Add the environment variables from `.env.example` in the Vercel project
   settings (Production + Preview).
4. Add the domain `analytiq.ng` and `www.analytiq.ng` in Vercel's Domains
   settings, and set `www.analytiq.ng` as the primary/canonical domain —
   Vercel will handle the apex → www redirect at the edge. `middleware.ts`
   also enforces this at the application layer as a safety net.
5. Deploy. Vercel handles HTTPS certificates automatically.

## Canonical domain & redirects

- Canonical host: `https://www.analytiq.ng`
- `analytiq.ng` (apex) redirects to `https://www.analytiq.ng` — configured
  both at the Vercel domain level (recommended) and as a fallback in
  `middleware.ts`.
- To add a legacy path redirect (e.g. if migrating from an old site
  structure), add an entry to the `redirects()` array in `next.config.mjs`.

## Adding a new blog post

Edit `lib/blog-data.ts` and add a new object to the `blogPosts` array:

```ts
{
  slug: 'your-post-slug',
  title: 'Your Post Title',
  metaDescription: 'One or two sentences for search engines.',
  excerpt: 'One sentence shown on the blog index card.',
  datePublished: '2026-08-01',
  readingTime: '5 min read',
  content: [
    { paragraphs: ['Opening paragraph...'] },
    { heading: 'A subheading', paragraphs: ['More content...'] },
  ],
}
```

The page at `/blog/your-post-slug` is generated automatically, complete with
`Article` JSON-LD and breadcrumb schema.

## Adding a new case study

Edit `lib/case-studies-data.ts` and add a new object to the `caseStudies`
array, following the existing shape (`challenge` / `approach` / `solution` /
`results` / `tech`). The page at `/case-studies/your-slug` is generated
automatically. Set `serviceSlug` to link it to the relevant service page.

## Editing services or pricing

All five service pages are generated from a single data file:
`lib/services-data.ts`. Each service object drives its own page at
`/services/[slug]` (problem, solution, deliverables, process, stack,
outcomes, FAQs, JSON-LD) as well as its card on the homepage, `/services`,
and `/pricing`. Update `fromPrice` here to change pricing site-wide.

## Project structure

```
app/                    Routes (App Router)
  page.tsx              Homepage
  about/                About page
  services/             Services index + [slug] dynamic detail page
  case-studies/         Case studies index + [slug] dynamic detail page
  blog/                 Blog index + [slug] dynamic detail page
  pricing/              Pricing page
  contact/              Contact page + server action (actions.ts)
  privacy/, terms/      Legal stub pages (noindex)
  sitemap.ts, robots.ts Dynamic SEO files
  not-found.tsx         Custom 404
components/             Reusable UI components
lib/                    Site config, SEO helpers, JSON-LD builders, content data
middleware.ts           HTTPS + www canonical host enforcement
```

## Before going live — checklist

- [ ] Replace placeholder image blocks (currently plain colour divs) with
      real photography — founder headshot, work samples, etc. — via
      `next/image`.
- [ ] Wire up real email delivery for the contact form (see above).
- [ ] Confirm `NEXT_PUBLIC_WHATSAPP_NUMBER` is correct and tested.
- [ ] Set up the Cal.com/Calendly link and confirm `NEXT_PUBLIC_BOOKING_URL`.
- [ ] Add a real `og-default.png` (1200×630) to `/public` for social share
      previews, or override per-page via `buildMetadata({ image: ... })`.
- [ ] Have the Privacy Policy and Terms pages reviewed against your actual
      data practices — the current copy is a clearly-labelled placeholder.
- [ ] Add Google Search Console + submit `sitemap.xml`.
- [ ] Set `NEXT_PUBLIC_GA_ID` if using Google Analytics, and confirm the CSP
      in `next.config.mjs` allows any analytics/booking scripts you add.
- [ ] Run `npm run build` locally and fix any type errors introduced by
      future edits before deploying.
