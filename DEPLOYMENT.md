# AnalytIQ Digital Deployment Guide

This guide is the short, production-first setup for deploying the CMS website to Vercel with an existing custom domain.

## 1) Your current admin login

Set a strong password for the super-admin account before deployment.

- Email: `admin@analytiq.ng`
- Password: use a unique, strong password stored in [.env](.env)

> Change the password immediately after the first login. This is the highest-privilege account for the CMS.

## 2) Required production environment variables

Set these in Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com`
- `NEXT_PUBLIC_CONTACT_EMAIL=info@yourdomain.com`
- `CONTACT_RECEIVING_EMAIL=info@yourdomain.com`
- `NEXT_PUBLIC_WHATSAPP_NUMBER=2348000000000`
- `NEXT_PUBLIC_BOOKING_URL=https://cal.com/your-link`
- `AUTH_SECRET=<32+ random characters>`
- `ADMIN_EMAIL=admin@yourdomain.com`
- `ADMIN_PASSWORD=ChangeThisPasswordNow!`
- `DATABASE_URL=<your hosted Postgres or Turso URL>`
- `DATABASE_AUTH_TOKEN=<if required>`
- `DIRECT_URL=<if using Postgres>`
- `VERCEL_BLOB_TOKEN=<your Vercel Blob token>`
- `GOOGLE_PLACES_API_KEY=<optional>`
- `GOOGLE_PLACE_ID=<optional>`
- `RESEND_API_KEY=<optional>`
- `NEXT_PUBLIC_GA_ID=<optional>`
- `WHATSAPP_WEBHOOK_URL=<optional for automated WhatsApp outreach>`
- `TWILIO_ACCOUNT_SID=<optional if using Twilio WhatsApp>`
- `TWILIO_AUTH_TOKEN=<optional if using Twilio WhatsApp>`
- `TWILIO_WHATSAPP_FROM=<optional if using Twilio WhatsApp>`
- `META_PIXEL_ID=<optional for Meta retargeting>`
- `GOOGLE_REMARKETING_ID=<optional for Google Ads remarketing>`

Important:
- Do not deploy with the local SQLite file for production.
- Do not leave the default `AUTH_SECRET` or `ADMIN_PASSWORD` in place.

## 3) Prepare the database for production

The app is build-ready, but Vercel is serverless. You must use a hosted database.

### Option A: Vercel Postgres or Neon

1. Create a Postgres database.
2. Copy the connection string into `DATABASE_URL`.
3. If needed, set `DIRECT_URL` for migrations.
4. Run the schema sync locally or via your DB tool:

```bash
npm install
npm run db:push
npm run db:seed
```

### Option B: Turso

1. Create a Turso database.
2. Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.
3. Push the schema and seed once:

```bash
npm run db:push
npm run db:seed
```

## 4) Media upload in production

The media upload route should not write to the local filesystem on Vercel. Use Vercel Blob or S3.

Recommended:

1. Create a Vercel Blob store in Vercel.
2. Generate a `VERCEL_BLOB_TOKEN`.
3. Add it to Vercel environment variables.
4. Keep using the existing media upload route, but ensure the environment is set before deployment.

## 5) Deploy to Vercel

1. Push the project to GitHub.
2. Open Vercel and click New Project.
3. Import the repository.
4. Select the project root.
5. Add all production environment variables.
6. Click Deploy.
7. Wait until the app is live.

## 6) Add your existing custom domain in Vercel

If you already own a domain such as `analytiq.ng`:

1. Open the Vercel project.
2. Go to Settings → Domains.
3. Click Add Domain.
4. Enter the apex domain: `analytiq.ng`
5. Enter the www version too: `www.analytiq.ng`
6. Vercel will give you the exact DNS records to add in your registrar.

Typical pattern:

- Apex domain: usually an `A` record or nameserver setup
- `www`: usually a `CNAME` to `cname.vercel-dns.com`

If your registrar supports Vercel nameservers:

1. Copy the nameservers Vercel gives you.
2. Replace your current registrar nameservers with Vercel's.
3. Wait for DNS propagation.

If your registrar uses custom DNS records instead:

1. Add the Vercel `A` / `CNAME` records exactly as provided.
2. Wait 5–30 minutes for propagation.
3. Continue after the domain shows as Verified.

## 7) Set the canonical domain

Use the primary domain as:

- `www.yourdomain.com`

This keeps URLs consistent and avoids duplicate SEO issues.

Set `NEXT_PUBLIC_SITE_URL` to the same canonical domain, for example:

```env
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
```

## 8) Log in to the admin dashboard

After deployment:

- Visit `https://www.yourdomain.com/admin`
- Log in with the admin email and the strong password set in your production environment variables

Then immediately change the password from the database or via your admin setup.

## 9) WhatsApp follow-up automation

Use one of these options for outbound follow-up:

### Option A: WhatsApp Business webhook

1. Create a WhatsApp Business account and a verified phone number.
2. Add your webhook URL in `WHATSAPP_WEBHOOK_URL`.
3. When a lead or site visitor matches a campaign, send the approved follow-up message.
4. Keep the message short, specific, and relevant to the page they viewed.

Example:

```text
Hi Ada, thanks for visiting AnalytIQ Digital. I saw your interest in website redesign. We help businesses grow with websites, automation, AI workflows, and analytics. If you'd like, I can suggest the best next step for your business. Chat with us on WhatsApp to get started.
```

### Option B: Twilio WhatsApp

1. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_FROM`.
2. Trigger a Twilio WhatsApp send after a lead form submission or a qualifying visit.
3. Keep a clear opt-in flow so the outreach is welcome and compliant.

## 10) Email lead nurturing

This app already stores leads in `/admin/leads` and is ready for a real email workflow:

1. Add `RESEND_API_KEY` if using Resend.
2. Add `CONTACT_RECEIVING_EMAIL` as the receiving inbox.
3. After `db.insert(leads)` in the contact action, send a confirmation email and a follow-up sequence.
4. Use the lead's `serviceInterest` to personalize the message.

Example nurture sequence:

- Email 1: thank-you + summary of what you viewed
- Email 2: offer a free consultation or site audit
- Email 3: case study / proof + CTA

## 11) Meta and Google retargeting audience setup

Use this only for people who visited your site or engaged with your content and have consent or legitimate interest under your local privacy rules.

### Meta Pixel

1. Create a Meta pixel in Meta Events Manager.
2. Add `META_PIXEL_ID` to production env.
3. Create a custom audience called `Website Visitors`.
4. Exclude people who already converted.
5. Retarget them with service-specific creatives and offers.

### Google Ads remarketing

1. Add `GOOGLE_REMARKETING_ID` or use your Google Ads tag.
2. Create a remarketing audience called `Website Visitors` in Google Ads.
3. Segment by:
   - pricing page visitors
   - service page visitors
   - contact form viewers
   - case study readers
4. Show conversion-focused display/search ads to those audiences.

## 12) Final production checklist

- [ ] `AUTH_SECRET` is unique and strong
- [ ] `ADMIN_PASSWORD` changed from the default
- [ ] Hosted database is configured
- [ ] `VERCEL_BLOB_TOKEN` is set
- [ ] `NEXT_PUBLIC_SITE_URL` matches your domain
- [ ] Vercel domain is verified
- [ ] `www` and apex domain are both configured
- [ ] Production admin login is working
- [ ] WhatsApp automation provider is configured if used
- [ ] Email nurture provider is configured if used
- [ ] Meta/Google retargeting audiences are configured

## 13) If you want a one-line answer

If you already own the domain and want to attach it to Vercel, the process is:

1. Add the domain in Vercel.
2. Copy the DNS records or nameservers.
3. Update your registrar.
4. Wait for DNS verification.
5. Deploy the app.
6. Configure the WhatsApp/email/retargeting tools.
7. Use the admin login and set a new password.
