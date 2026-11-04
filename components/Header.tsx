'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [ecoOpen, setEcoOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px animate-gradient-pan bg-accent-gradient bg-[length:200%_auto] opacity-70"
        aria-hidden="true"
      />
      <div className="container-page flex h-16 items-center justify-between py-2 sm:h-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="AnalytIQ Digital"
            width={160}
            height={107}
            priority
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setEcoOpen(true)}
            onMouseLeave={() => setEcoOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-ink/75 transition hover:text-brand"
              aria-expanded={ecoOpen}
              onClick={() => setEcoOpen((v) => !v)}
            >
              Ecosystem
              <ChevronDown size={14} className={ecoOpen ? 'rotate-180 transition' : 'transition'} />
            </button>

            {ecoOpen && (
              <div className="absolute left-0 top-full w-80 pt-3">
                <div className="ai-border shadow-soft">
                  <div className="p-2">
                    {siteConfig.ecosystem.map((item) =>
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          className="block rounded-xl p-3 transition hover:bg-surface-off"
                        >
                          <span className="flex items-center gap-1 text-sm font-semibold text-brand">
                            {item.label}
                            <ArrowUpRight size={14} className="text-accent-teal" />
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-ink/65">
                            {item.description}
                          </span>
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-xl p-3 transition hover:bg-surface-off"
                          onClick={() => setEcoOpen(false)}
                        >
                          <span className="text-sm font-semibold text-brand">{item.label}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-ink/65">
                            {item.description}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/75 transition hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/book-a-consultation" className="btn-primary">
            Book a Consultation
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
            <p className="px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-accent-teal">
              Ecosystem
            </p>
            {siteConfig.ecosystem.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-surface-off hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-surface-off hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}

            <p className="px-2 pt-3 text-xs font-semibold uppercase tracking-wider text-accent-teal">
              Company
            </p>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-surface-off hover:text-brand"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/book-a-consultation"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Book a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
