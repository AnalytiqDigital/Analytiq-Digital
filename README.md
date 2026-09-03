# AnalytIQ Digital — Website

A production-ready marketing website **and** admin-managed CMS/backend for
**AnalytIQ Digital** (analytiq.ng), built with Next.js 15 (App Router) +
TypeScript + Tailwind CSS, Drizzle ORM, and a real authenticated admin
dashboard.

> Where Data Meets Intelligence.

## What's in this project

- A full public website: Home, About, 6 Services, Solutions, Portfolio
  (with category filtering), Case Studies, Blog, Pricing, Contact, Privacy,
  Terms — all with unique SEO metadata and JSON-LD structured data.
- A real database (Drizzle ORM) with 11 tables covering everything the
  admin can manage: services, portfolio, case studies, clients,
  testimonials, reviews, blog posts, leads, media, site settings, and admin
  users.
- A password-protected `/admin` dashboard with authentication (bcrypt +
  signed JWT session cookie) and CRUD screens for every content type.
- A generic, reusable admin CRUD API (`/api/admin/[resource]`) — one
  pattern powers Services, Portfolio, Case Studies, Clients, Testimonials,
  Blog, Leads, and Media, rather than bespoke code per entity.
- A contact form that writes real leads into the database, manageable from
  `/admin/leads` with a New → Contacted → Proposal → Won → Lost workflow.
- A Google Reviews integration that only ever shows **real** reviews (or an
  honest "not yet connected" state) — never fabricated content.

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Drizzle ORM** with **libSQL** (via `@libsql/client`) for local
  development — see "Migrating to Turso or Postgres for production" below
  before deploying
- `jose` (JWT) + `bcryptjs` for admin authentication — no third-party auth
  service required
- Native Next.js Metadata API + hand-written JSON-LD for SEO
- lucide-react for icons

### A note on why Drizzle + libSQL instead of Prisma or better-sqlite3

This project was originally built in a sandboxed environment where
Prisma's engine binary CDN (`binaries.prisma.sh`) was unreachable, so
Drizzle was used instead. The first version used Drizzle with
`better-sqlite3`, which worked in that sandbox — but `better-sqlite3`
compiles native C++ code via `node-gyp` on install, which requires Visual
Studio Build Tools (the "Desktop development with C++" workload) on
Windows and can fail on newer Node.js versions that don't yet have a
published prebuilt binary. This caused real install failures during
development.

The project now uses **libSQL** (`@libsql/client`, Turso's SQLite-compatible
engine) instead. It ships prebuilt native bindings for every major platform
via napi, needs zero compilation on install, and is a fully compatible
local file-based SQLite database — `db/index.ts` points it at
`./data/app.db` by default, exactly like `better-sqlite3` did. It's also a
much smaller step to a *hosted* database later: libSQL's hosted version is
Turso, and switching from a local file to a hosted Turso database is a
one-line URL change (see the migration section below) rather than a driver
swap.

If you'd prefer Prisma or Postgres from the start, the schema in
`db/schema.ts` is a straightforward reference for translating table
definitions.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values, see below
npm run db:push               # create the local SQLite database from the schema
npm run db:seed               # create the admin user + import starter content
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` for the dashboard (log in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env.local`, default
`admin@analytiq.ng` / `change-me-now` — **change this before deploying**).

> **If `npm run db:seed` fails with `SQLITE_ERROR: no such table: users`:**
> this means `npm run db:push` either wasn't run, or (on some setups)
> wrote to a different file than the app then read from. `npm run db:seed`
> prints the exact database file path it's using (`Database file:
> file:./data/app.db`) — this should always be a plain relative path. If
> you've edited `DATABASE_URL` yourself, make sure it's a forward-slash
> path (`file:./data/app.db`, not `file:C:\Users\...\data\app.db`) —
> Windows-style absolute paths with backslashes aren't valid file URLs and
> will silently point libSQL at an empty database in the wrong place
> rather than erroring clearly.

## Environment variables

See `.env.example` for the full list.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata, sitemap, and JSON-LD. Must be `https://www.analytiq.ng` in production. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email shown in the footer, contact page, and mailto links. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format, digits only (e.g. `2348012345678`). |
| `NEXT_PUBLIC_BOOKING_URL` | Cal.com / Calendly link for "Book a Free 15-Minute Consultation". |
| `AUTH_SECRET` | **Required.** A long random string (32+ chars) used to sign admin session JWTs. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Rotating this instantly invalidates all admin sessions. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by `npm run db:seed` to create the first admin user. Change the password immediately after first login (there's no in-app "change password" screen yet — see "Known gaps" below). |
| `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` | Server-only — enables real Google Reviews. Without these, the Reviews section and `/admin/reviews` honestly show a "not connected" state rather than fake reviews. |
| `RESEND_API_KEY` / `CONTACT_RECEIVING_EMAIL` | Reserved for wiring the contact form to real email notifications (see "Known gaps"). |
| `NEXT_PUBLIC_GA_ID` | Optional analytics ID. |

## The admin dashboard

Once logged in at `/admin`, you can manage:

- **Overview** — live counts pulled straight from the database.
- **Services** — the 6 core services shown on `/services`.
- **Portfolio** — projects shown on `/portfolio`, with category, tech tags, etc.
- **Case Studies** — the deep-dive stories shown on `/case-studies`.
- **Clients** — logos for the homepage client slider. The slider shows
  clearly-labelled placeholder slots until you add real ones here — it
  never fabricates client names.
- **Testimonials** — add these only once manually verified with the
  client. The homepage only shows a testimonials section once at least one
  exists.
- **Google Reviews** — a "Sync now" button pulls real reviews from the
  Google Places API (once configured) into the database for a synced
  history; the public site always fetches live from Google directly.
- **Blog** — draft / scheduled / published workflow, SEO fields per post.
- **Leads** — every contact form submission, with a status pipeline and
  internal notes.
- **Media Library** — upload images, copy the URL into any "Image URL"
  field elsewhere in the admin.
- **Settings** — company name, tagline, contact info, social links,
  Google Place ID, default SEO title/description.

## Database commands

```bash
npm run db:generate   # generate a new SQL migration after editing db/schema.ts
npm run db:push        # apply the schema directly to the local SQLite file (dev)
npm run db:seed        # create admin user + import starter content (idempotent)
npm run db:studio      # open Drizzle Studio, a GUI for browsing/editing the DB
```

## Migrating to Turso or Postgres for production

A local libSQL file (`./data/app.db`) is verified and great for local
development, but serverless platforms like Vercel don't provide a durable
writable filesystem across invocations/deploys — you need a hosted
database. You have two good options:

### Option A: Turso (hosted libSQL) — smallest change

Since the project already uses `@libsql/client`, moving to Turso (its
hosted version) is just environment variables, no code changes:

1. Create a free database at [turso.tech](https://turso.tech) and grab its
   URL (`libsql://your-db-name.turso.io`) and an auth token.
2. Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in your production
   environment (Vercel project settings) — `db/index.ts` and
   `drizzle.config.ts` already read these and fall back to the local file
   only when they're unset.
3. Run `npm run db:push` locally with those env vars set (or via Turso's
   CLI) to create the schema on the hosted database, then `npm run db:seed`.

### Option B: Hosted Postgres (Vercel Postgres, Neon, Supabase)

More setup, but a more common choice if you're already using Postgres
elsewhere:

1. `npm install drizzle-orm pg` (or `postgres` for the postgres-js driver)
   and remove `@libsql/client`.
2. In `db/schema.ts`, change the import from `drizzle-orm/sqlite-core` to
   `drizzle-orm/pg-core`, and swap the column helpers: `sqliteTable` →
   `pgTable`, `integer(...).primaryKey({ autoIncrement: true })` →
   `serial('id').primaryKey()`, `integer(..., { mode: 'timestamp' })` →
   `timestamp(...)`, `text(..., { mode: 'json' })` → `jsonb(...)`.
3. In `db/index.ts`, replace the libSQL connection with a Postgres
   connection pointed at `process.env.DATABASE_URL`.
4. Update `drizzle.config.ts`'s `dialect` to `'postgresql'`.
5. Run `npm run db:push` (or `db:generate` + a migration runner) against
   the new database, then `npm run db:seed`.

Either way, the rest of the app — API routes, admin UI, auth — doesn't need
to change, since it all goes through Drizzle's query builder rather than
raw SQL.

## Wiring up real email notifications for leads

`app/contact/actions.ts` currently validates the form, runs a honeypot
check, applies a simple in-memory rate limit, and saves the lead directly
to the database (visible immediately in `/admin/leads`). It does **not**
yet send an email notification — this is a clear, intentional integration
point rather than a guessed provider. To finish it:

1. Pick a transactional email provider (Resend, Postmark, SendGrid, etc.).
2. Add its API key to your environment variables (`RESEND_API_KEY` is
   already reserved in `.env.example`).
3. After the `db.insert(leads)` call in `submitContactForm`, call the
   provider's API to notify `CONTACT_RECEIVING_EMAIL`.
4. For production, also replace the in-memory rate limiter (here and in
   `/api/auth/login`) with a durable store (e.g. Upstash Redis), since it
   resets on every cold start and isn't shared across serverless instances.

## Media storage in production

`/api/admin/media/upload` currently writes files to `public/uploads` on
local disk — fine for local development, but this **will not work** on
Vercel (the filesystem is ephemeral/read-only outside `/tmp`). Before
deploying, swap this route for an object storage provider — Vercel Blob is
the least setup for a Vercel deployment; S3 or Cloudinary work too. Only
this one route needs to change; the `Media` table and the rest of the
admin UI are storage-provider agnostic.

## Google Reviews integration

`lib/google-reviews.ts` calls the Google Places API (Place Details)
server-side only — the API key is never exposed to the browser. Set
`GOOGLE_PLACES_API_KEY` (restrict it to your server's IP/referrer in the
Google Cloud Console) and `GOOGLE_PLACE_ID` (the Place ID for the AnalytIQ
Digital Google Business listing) to activate it. Until then, both the
public Reviews section and `/admin/reviews` show an honest "not yet
connected" message — the app never fabricates review content, ratings, or
reviewer names.

Note: the Places API returns at most 5 "most relevant" reviews per
request, not the complete review history. The `/admin/reviews` → "Sync
now" button persists synced reviews into the database over time so you
build up more than 5 without needing a third-party scraper (which would
violate Google's terms).

## Known gaps / next steps

Being upfront about what's simplified or not yet built, rather than
overstating scope:

- **Services pages are the one exception to "fully database-driven."** The
  Services list (`/services`) and detail pages (`/services/[slug]`) still
  read from `lib/services-data.ts`, not the database — even though
  `/admin/services` lets you edit a `services` database table. This is
  intentional, not an oversight: each service's detail page needs richer
  structured content (a multi-step process, an FAQ list, a tech stack,
  outcomes) than the current generic admin form supports (it only handles
  flat text/number/tag fields, not arrays of objects like `{question,
  answer}` pairs). Converting this fully would mean either expanding the
  `services` schema + building a dedicated (non-generic) admin form for
  services specifically — a reasonable next increment, following the exact
  pattern used for Portfolio/Case Studies/Blog in `lib/queries.ts` — or
  accepting that service copy changes go through code rather than the
  admin UI. **Every other content type — Portfolio, Case Studies, Blog,
  Clients, Testimonials — is fully live from the database**: an edit in
  `/admin` appears on the public site immediately, no rebuild or redeploy
  needed (verified end-to-end during development).
- **No in-app "change admin password" or "invite another admin" screen
  yet.** Change the seeded password by re-running `npm run db:seed` with a
  new `ADMIN_PASSWORD` after manually deleting the old user row, or add a
  password-change route following the same pattern as `/api/auth/login`.
- **Media library has no built-in image resizing/optimization pipeline.**
  Uploaded images are stored as-is; `next/image` still optimizes them for
  display, but there's no automatic multi-size generation on upload.
- **No dedicated Categories table** — blog posts have a free-text
  `category` field and a `tags` array instead of a separate managed
  Categories entity, to keep the schema simpler. Easy to split out later
  if you need category-specific landing pages.
- **Rate limiting (login attempts, contact form submissions) is
  in-memory** and resets on cold start / isn't shared across serverless
  instances — fine for a single small deployment, replace with a durable
  store (Upstash Redis is a common, low-setup choice) if traffic grows.
- **No client logos or verified testimonials are seeded** — by design,
  since neither should be fabricated. Add real ones via `/admin/clients`
  and `/admin/testimonials` once you have them; both public sections
  gracefully show placeholder/empty states until then, and both are fully
  live from the database like the rest of the content above.
- **Homepage and all content-listing pages are now `force-dynamic`**
  (server-rendered per request against the live database) rather than
  statically generated, since their content can change via the admin at
  any time. This is the right tradeoff for a real CMS, but means slightly
  higher server load than a fully static site — add `export const
  revalidate = 60` (or similar) instead of `force-dynamic` on any of these
  pages if you'd rather trade a short cache delay for lower server load.

## Fonts

The site uses a system-first font stack (`-apple-system`, Segoe UI,
Roboto, etc.) defined in `tailwind.config.ts` — fast, zero network
requests at build time. To switch to a specific webfont via
`next/font/google`, add it in `app/layout.tsx` and update
`fontFamily.sans` / `fontFamily.display` in `tailwind.config.ts` to lead
with the font's CSS variable (requires network access to
`fonts.googleapis.com` at build time).

## Deploying to Vercel

1. **Before deploying**, complete the Turso/Postgres migration and media
   swap above — the SQLite + local-disk setup here is for local
   development only.
2. Push this repository to GitHub (or GitLab/Bitbucket) and import it into
   Vercel.
3. Add all environment variables from `.env.example` (with real
   production values) in the Vercel project settings.
4. Add the domain `analytiq.ng` and `www.analytiq.ng` in Vercel's Domains
   settings, and set `www.analytiq.ng` as the primary/canonical domain —
   Vercel handles the apex → www redirect at the edge.
   `middleware.ts` also enforces this and forces HTTPS at the application
   layer as a safety net (this is why `npm run start` locally redirects
   plain-HTTP requests — see the comment in `middleware.ts`).
5. Deploy. Vercel handles HTTPS certificates automatically.

## Adding content without the admin UI

Everything in the admin dashboard is also directly editable via
`npm run db:studio` (Drizzle Studio), which opens a full database GUI —
useful for bulk edits or fixing something quickly outside the CRUD forms.

## Project structure

```
app/
  page.tsx                 Homepage
  about/, services/, solutions/, portfolio/, case-studies/, blog/,
  pricing/, contact/, privacy/, terms/     Public routes
  admin/                    Password-protected dashboard (see below)
  api/
    admin/[resource]/       Generic CRUD API for services/portfolio/etc.
    admin/settings/         Singleton site settings API
    admin/media/upload/     File upload + Media table
    admin/reviews/sync/     Pulls real Google reviews into the DB
    admin/stats/            Overview dashboard counts
    auth/login, auth/logout Admin session endpoints
    reviews/                Public-facing live Google reviews endpoint
  sitemap.ts, robots.ts     Dynamic SEO files
db/
  schema.ts                 Drizzle schema — all 11 tables
  index.ts                  DB client (libSQL for dev, points to Turso/Postgres in prod)
  seed.ts                   Creates admin user + imports starter content
  migrations/                Generated SQL migrations
lib/
  site-config.ts             Brand name, tagline, address, nav, socials
  services-data.ts, portfolio-data.ts, case-studies-data.ts,
  blog-data.ts, solutions-data.ts, clients-data.ts,
  testimonials-data.ts       Seed-time content (source of truth is the DB
                              after seeding; these files are what
                              `db:seed` imports from)
  auth.ts, auth-edge.ts      Session/auth helpers (Node vs Edge runtime)
  admin-resources.ts         Maps admin API resource names to DB tables
  google-reviews.ts          Real Google Places API integration
  schema.ts (JSON-LD), seo.ts   SEO helpers
components/
  admin/                     ResourceManager (generic CRUD UI), sidebar, etc.
  (rest)                     Public site components
middleware.ts                 HTTPS/www canonicalization + admin route protection
```

## Before going live — checklist

- [ ] Complete the Turso/Postgres migration (see above) — do not deploy with
      SQLite on a serverless platform.
- [ ] Swap media upload to object storage (see above).
- [ ] Change the seeded admin password; set a strong, unique `AUTH_SECRET`.
- [ ] Wire up real email delivery for contact form leads (see above).
- [ ] Set `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` once you have the
      real AnalytIQ Digital Google Business Profile, or leave the Reviews
      section in its honest "not connected" state.
- [ ] Add real client logos via `/admin/clients` and any manually-verified
      testimonials via `/admin/testimonials` — both are empty by design.
- [ ] Replace the placeholder image blocks (gradient/color divs) with real
      photography, screenshots, and diagrams via `next/image`.
- [ ] Add a real `og-default.png` (1200×630) to `/public` for social share
      previews, or override per-page via `buildMetadata({ image: ... })`.
- [ ] Have the Privacy Policy and Terms pages reviewed against your actual
      data practices — the current copy is a clearly-labelled placeholder.
- [ ] Add Google Search Console and submit `sitemap.xml`.
- [ ] Run `npm audit` and address anything new since this was built —
      dependencies (especially Next.js) get security patches frequently;
      don't assume the pinned version here stays current indefinitely.
