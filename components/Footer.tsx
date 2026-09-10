import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { services } from '@/lib/services-data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white/80">
      <div
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-pattern opacity-40"
        aria-hidden="true"
      />
      <div className="container-page relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-xl bg-white/95 p-3">
            <Image
              src="/logo.png"
              alt="AnalytIQ Digital"
              width={140}
              height={93}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-accent-light">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">{siteConfig.positioning}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Services</h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-accent-light">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Ecosystem</h3>
          <ul className="space-y-2 text-sm">
            {siteConfig.ecosystem.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} className="hover:text-accent-light">{item.label}</a>
                ) : (
                  <Link href={item.href} className="hover:text-accent-light">{item.label}</Link>
                )}
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-white/90">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent-light">About</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent-light">Portfolio</Link></li>
            <li><Link href="/case-studies" className="hover:text-accent-light">Case Studies</Link></li>
            <li><Link href="/blog" className="hover:text-accent-light">Blog</Link></li>
            <li><Link href="/pricing" className="hover:text-accent-light">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-accent-light">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="max-w-[220px] leading-relaxed">{siteConfig.address}</li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-light">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              <a href={siteConfig.social.linkedin} className="hover:text-accent-light" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href={siteConfig.social.x} className="hover:text-accent-light" aria-label="X (Twitter)">
                X
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} {siteConfig.legalName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
