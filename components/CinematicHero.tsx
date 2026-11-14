'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Globe,
  Palette,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { defaultWhatsappMessage, siteConfig, whatsappLink } from '@/lib/site-config';
import Magnetic from '@/components/Magnetic';
import NeuralField from '@/components/NeuralField';

const AUTOPLAY_MS = 5000;

type SlidePattern = 'grid' | 'particles' | 'orbs' | 'lines';

interface Slide {
  id: string;
  badge: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  accent: string;
  onAccent: string;
  glow: string;
  Icon: LucideIcon;
  pattern: SlidePattern;
}

const SLIDES: Slide[] = [
  {
    id: 'website-development',
    badge: 'Websites that convert',
    title: 'Website Development',
    description:
      'Lightning-fast, SEO-ready websites that turn visitors into enquiries — built mobile-first for how Nigeria actually browses.',
    points: ['Loads in under 2s on mobile data', 'SEO structure built in from day one', 'A clear next step on every page'],
    href: '/services/website-development',
    cta: 'Build my website',
    accent: '#22d3ee',
    onAccent: '#06222b',
    glow: 'rgba(34, 211, 238, 0.35)',
    Icon: Globe,
    pattern: 'grid',
  },
  {
    id: 'ai-workflows',
    badge: 'Automate the repetitive',
    title: 'AI Workflows',
    description:
      'We connect the tools you already use and add AI where it saves real hours — drafting, triaging and routing, with human review where it matters.',
    points: ['Hours returned to your team weekly', 'Faster first-response on enquiries', 'Error alerts instead of silent failures'],
    href: '/services/ai-automation',
    cta: 'Automate my operations',
    accent: '#8b5cf6',
    onAccent: '#ffffff',
    glow: 'rgba(139, 92, 246, 0.4)',
    Icon: BrainCircuit,
    pattern: 'particles',
  },
  {
    id: 'website-design',
    badge: 'Design that persuades',
    title: 'Website Design',
    description:
      'Premium, on-brand interfaces with obsessive attention to layout, typography and motion — designed to make the next step obvious.',
    points: ['Custom layouts matched to your brand', 'Motion and micro-interactions', 'Designed around one clear CTA'],
    href: '/portfolio',
    cta: 'See design in action',
    accent: '#f472b6',
    onAccent: '#ffffff',
    glow: 'rgba(244, 114, 182, 0.35)',
    Icon: Palette,
    pattern: 'orbs',
  },
  {
    id: 'software-development',
    badge: 'Built around your workflow',
    title: 'Software Development',
    description:
      'Custom web apps, ERPs and internal tools scoped tightly around how your team actually works — no bloated modules you never touch.',
    points: ['Scoped requirements before any code', 'Replaces scattered spreadsheets', 'Deployed with team training'],
    href: '/services/custom-software',
    cta: 'Scope my software',
    accent: '#a3e635',
    onAccent: '#1a2e05',
    glow: 'rgba(163, 230, 53, 0.3)',
    Icon: Code2,
    pattern: 'lines',
  },
];

const RING_R = 12;
const RING_C = 2 * Math.PI * RING_R;

function SlideBackdrop({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 2 + ((i * 7) % 3),
        duration: 3.5 + ((i * 13) % 30) / 10,
        delay: ((i * 17) % 20) / 10,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {slide.pattern === 'grid' && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 90% 85% at 50% 40%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 40%, black 30%, transparent 75%)',
          }}
        />
      )}
      {slide.pattern === 'lines' && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `repeating-linear-gradient(115deg, ${slide.accent}14 0px, ${slide.accent}14 1px, transparent 1px, transparent 14px)`,
            maskImage: 'radial-gradient(ellipse 90% 85% at 50% 40%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 40%, black 30%, transparent 75%)',
          }}
        />
      )}
      {slide.pattern === 'orbs' && (
        <>
          <div
            className="absolute -left-10 -top-10 h-52 w-52 rounded-full blur-3xl"
            style={{ background: `${slide.accent}33` }}
          />
          <div
            className="absolute -bottom-14 -right-10 h-60 w-60 rounded-full blur-3xl"
            style={{ background: 'rgba(139, 92, 246, 0.22)' }}
          />
          <div
            className="absolute left-1/3 top-1/2 h-32 w-32 rounded-full blur-2xl"
            style={{ background: 'rgba(34, 211, 238, 0.14)' }}
          />
        </>
      )}
      {(slide.pattern === 'particles' || slide.pattern === 'grid') &&
        dots.map((d, i) => (
          <span
            key={i}
            className={reduced ? 'absolute rounded-full' : 'hero-anim hero-drift absolute rounded-full'}
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background: slide.accent,
              opacity: reduced ? 0.4 : undefined,
              animationDuration: reduced ? undefined : `${d.duration}s`,
              animationDelay: reduced ? undefined : `${d.delay}s`,
            }}
          />
        ))}
      {/* Accent corner glow shared by all slides */}
      <div
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ background: `${slide.accent}26` }}
      />
    </div>
  );
}

function SlideVisual({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  const barWidths = ['92%', '78%', '86%', '64%'];
  if (slide.id === 'website-development') {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40" aria-hidden="true">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 h-3 flex-1 rounded bg-white/5" />
        </div>
        <div className="space-y-2 p-3">
          {barWidths.map((w, i) => (
            <div
              key={i}
              className={reduced ? '' : 'hero-anim hero-bar'}
              style={{
                width: w,
                height: 8,
                borderRadius: 9999,
                transformOrigin: 'left center',
                background: `linear-gradient(90deg, ${slide.accent}66, ${slide.accent}1f)`,
                animationDelay: reduced ? undefined : `${250 + i * 120}ms`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (slide.id === 'ai-workflows') {
    return (
      <div className="relative mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-5" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <line x1="22%" y1="50%" x2="50%" y2="28%" stroke={slide.accent} strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="22%" y1="50%" x2="50%" y2="72%" stroke={slide.accent} strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="50%" y1="28%" x2="78%" y2="50%" stroke={slide.accent} strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="50%" y1="72%" x2="78%" y2="50%" stroke={slide.accent} strokeOpacity="0.5" strokeWidth="1.5" />
        </svg>
        {['In', 'AI', 'Out'].map((label, i) => (
          <div
            key={label}
            className={reduced ? 'relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border text-xs font-bold' : 'hero-anim hero-node relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border text-xs font-bold'}
            style={{
              borderColor: `${slide.accent}55`,
              background: `${slide.accent}14`,
              color: slide.accent,
              animationDelay: reduced ? undefined : `${i * 0.35}s`,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }
  if (slide.id === 'website-design') {
    return (
      <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4" aria-hidden="true">
        <div className="flex items-center gap-2">
          {['#22d3ee', '#8b5cf6', '#f472b6', '#a3e635', '#ffffff'].map((c, i) => (
            <span
              key={c}
              className={reduced ? 'h-6 w-6 rounded-full border border-white/20' : 'hero-anim hero-pop h-6 w-6 rounded-full border border-white/20'}
              style={{ background: c, animationDelay: reduced ? undefined : `${200 + i * 80}ms` }}
            />
          ))}
          <div className="ml-2 h-6 flex-1 rounded-md bg-white/5" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="col-span-2 h-10 rounded-md" style={{ background: `${slide.accent}26` }} />
          <div className="h-10 rounded-md bg-white/5" />
          <div className="h-10 rounded-md bg-white/5" />
          <div className="col-span-2 h-10 rounded-md" style={{ background: 'rgba(139, 92, 246, 0.18)' }} />
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/50 font-mono text-[11px] leading-5" aria-hidden="true">
      <div className="border-b border-white/10 px-3 py-1.5 text-white/40">~/analytiq — deploy</div>
      <div className="space-y-1 p-3">
        <p><span style={{ color: slide.accent }}>$</span> <span className="text-white/70">npm run build</span></p>
        <p className="text-white/40">✓ Compiled in 1.8s — 0 errors</p>
        <p><span style={{ color: slide.accent }}>$</span> <span className="text-white/70">vercel deploy --prod</span></p>
        <p
          className={reduced ? 'font-semibold' : 'hero-anim hero-fade font-semibold'}
          style={{ color: slide.accent, animationDelay: reduced ? undefined : '500ms' }}
        >
          ● Live in 22s — 100/100 performance
        </p>
      </div>
    </div>
  );
}

export default function CinematicHero() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const touchX = useRef<number | null>(null);
  const slide = SLIDES[active];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setActive((a) => (a + 1) % SLIDES.length);
  }, []);
  const prev = useCallback(() => {
    setDirection(-1);
    setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);
  }, []);
  const goTo = useCallback((i: number) => {
    const n = (i + SLIDES.length) % SLIDES.length;
    if (n === active) return;
    setDirection(n > active ? 1 : -1);
    setActive(n);
  }, [active]);

  useEffect(() => {
    if (reduced || paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduced, next]);

  const handleTilt = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 10 });
  };
  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <section data-hero-field aria-label="AnalytIQ Digital — websites, software, AI and analytics" className="relative overflow-hidden bg-[#0b0f19] text-white">
      <style>{`
        @keyframes hero-enter-right { from { opacity: 0; transform: translateX(64px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes hero-enter-left { from { opacity: 0; transform: translateX(-64px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes hero-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes hero-left-in { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        @keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hero-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes hero-bar { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
        @keyframes hero-drift { 0%, 100% { transform: translateY(0); opacity: 0.25; } 50% { transform: translateY(-14px); opacity: 0.9; } }
        @keyframes hero-node { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes hero-ring { from { stroke-dashoffset: ${RING_C}; } to { stroke-dashoffset: 0; } }
        .hero-anim { animation-fill-mode: both; }
        .hero-enter-right { animation: hero-enter-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-enter-left { animation: hero-enter-left 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-rise { animation: hero-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-left-in { animation: hero-left-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-fade { animation: hero-fade 0.6s ease both; }
        .hero-pop { animation: hero-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-bar { animation: hero-bar 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .hero-drift { animation: hero-drift 4s ease-in-out infinite; }
        .hero-node { animation: hero-node 2.2s ease-in-out infinite; }
        .hero-ring { animation: hero-ring ${AUTOPLAY_MS / 1000}s linear both; }
        .hero-tilt { transition: transform 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim, .hero-enter-right, .hero-enter-left, .hero-rise, .hero-left-in,
          .hero-fade, .hero-pop, .hero-bar, .hero-drift, .hero-node, .hero-ring { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Cinematic radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 480px at 12% -5%, rgba(34,211,238,0.16), transparent 60%), radial-gradient(860px 520px at 88% 8%, rgba(99,102,241,0.20), transparent 62%), radial-gradient(700px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%)',
        }}
      />
      <NeuralField density={0.85} />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-24">
        {/* Left — conversion-optimized value proposition */}
        <div className="max-w-2xl">
          <span
            className={reduced ? 'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-md' : 'hero-anim hero-left-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-md'}
          >
            <Sparkles size={14} aria-hidden="true" /> AI-Powered Digital Transformation
          </span>

          <h1 className={reduced ? 'mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl' : 'hero-anim hero-left-in mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl'} style={reduced ? undefined : { animationDelay: '80ms' }}>
            Websites, Software, AI &amp; Analytics
            <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              that grow your business.
            </span>
          </h1>

          <p className={reduced ? 'mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg' : 'hero-anim hero-left-in mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg'} style={reduced ? undefined : { animationDelay: '160ms' }}>
            {siteConfig.positioning}
          </p>

          <div className={reduced ? 'mt-8 flex flex-col gap-3 sm:flex-row sm:items-center' : 'hero-anim hero-left-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'} style={reduced ? undefined : { animationDelay: '240ms' }}>
            <Magnetic strength={22}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-300 px-6 py-3 text-sm font-bold text-[#06222b] shadow-[0_0_36px_-8px_rgba(34,211,238,0.7)] transition hover:brightness-110"
              >
                Start a Project <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
            </Magnetic>
            <Magnetic strength={16}>
              <a
                href={siteConfig.erpSignupUrl}
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
              >
                Try AnalytIQ ERP Free
              </a>
            </Magnetic>
          </div>

          <a
            href={whatsappLink(defaultWhatsappMessage)}
            className={reduced ? 'mt-4 inline-block text-sm font-medium text-white/60 underline-offset-4 transition hover:text-cyan-200 hover:underline' : 'hero-anim hero-left-in mt-4 inline-block text-sm font-medium text-white/60 underline-offset-4 transition hover:text-cyan-200 hover:underline'}
            style={reduced ? undefined : { animationDelay: '320ms' }}
          >
            Prefer chat? Message us on WhatsApp →
          </a>

          <ul className={reduced ? 'mt-8 space-y-2.5 text-sm text-white/70' : 'hero-anim hero-left-in mt-8 space-y-2.5 text-sm text-white/70'} style={reduced ? undefined : { animationDelay: '400ms' }}>
            {[
              'Fast, SEO-ready builds that work on mobile data',
              'AI automation with human oversight where it matters',
              'Clear scope & pricing before you commit',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-300/15">
                  <Check size={11} className="text-cyan-300" aria-hidden="true" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — immersive interactive card slider */}
        <div
          className="group relative mx-auto w-full max-w-xl"
          style={{ perspective: '1000px' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            style={reduced ? undefined : { transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transformStyle: 'preserve-3d' }}
            className="hero-tilt relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            {/* Accent top edge + glow */}
            <div
              className="absolute inset-x-8 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${slide.accent}, transparent)` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -inset-px -z-10 rounded-2xl blur-2xl transition-all duration-700"
              style={{ background: `radial-gradient(60% 50% at 50% 0%, ${slide.glow}, transparent 70%)`, opacity: 0.5 }}
              aria-hidden="true"
            />

            <div
              className="relative overflow-hidden rounded-2xl"
              role="region"
              aria-roledescription="carousel"
              aria-label="Core services"
              aria-live="polite"
              onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
              onTouchEnd={(e) => {
                const startX = touchX.current;
                if (startX == null) return;
                const endX = e.changedTouches[0]?.clientX ?? startX;
                const dx = endX - startX;
                touchX.current = null;
                if (dx < -50) next();
                else if (dx > 50) prev();
              }}
            >
              <article
                key={slide.id}
                className={reduced ? 'relative flex min-h-[600px] flex-col p-6 sm:min-h-[580px] sm:p-8' : `hero-anim relative flex min-h-[600px] flex-col p-6 sm:min-h-[580px] sm:p-8 ${direction >= 0 ? 'hero-enter-right' : 'hero-enter-left'}`}
              >
                <SlideBackdrop slide={slide} reduced={reduced} />
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className={reduced ? 'flex items-start justify-between gap-4' : 'hero-anim hero-rise flex items-start justify-between gap-4'} style={reduced ? undefined : { animationDelay: '60ms' }}>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]"
                      style={{ borderColor: `${slide.accent}55`, background: `${slide.accent}14`, color: slide.accent, boxShadow: `0 0 18px -4px ${slide.glow}` }}
                    >
                      <slide.Icon size={12} aria-hidden="true" /> {slide.badge}
                    </span>
                    <span
                      className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:inline-flex"
                      style={{ color: slide.accent }}
                    >
                      <slide.Icon size={20} aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className={reduced ? 'mt-5 text-2xl font-bold tracking-tight sm:text-3xl' : 'hero-anim hero-rise mt-5 text-2xl font-bold tracking-tight sm:text-3xl'} style={reduced ? undefined : { animationDelay: '140ms' }}>
                    {slide.title}
                  </h3>
                  <p className={reduced ? 'mt-2.5 max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]' : 'hero-anim hero-rise mt-2.5 max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]'} style={reduced ? undefined : { animationDelay: '220ms' }}>
                    {slide.description}
                  </p>

                  <ul className={reduced ? 'mt-4 space-y-2 text-[13px] text-white/65' : 'hero-anim hero-rise mt-4 space-y-2 text-[13px] text-white/65'} style={reduced ? undefined : { animationDelay: '300ms' }}>
                    {slide.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: slide.accent, boxShadow: `0 0 8px ${slide.accent}` }} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className={reduced ? undefined : 'hero-anim hero-rise'} style={reduced ? undefined : { animationDelay: '380ms' }}>
                    <SlideVisual slide={slide} reduced={reduced} />
                  </div>

                  <div className={reduced ? 'mt-auto pt-6' : 'hero-anim hero-rise mt-auto pt-6'} style={reduced ? undefined : { animationDelay: '460ms' }}>
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
                      style={{ background: slide.accent, color: slide.onAccent, boxShadow: `0 0 28px -8px ${slide.glow}` }}
                    >
                      {slide.cta} <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* Controls: dots + counter/countdown */}
            <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose service">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Go to ${s.title}`}
                    onClick={() => goTo(i)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? 28 : 8,
                      background: i === active ? `linear-gradient(90deg, ${s.accent}, #818cf8)` : 'rgba(255,255,255,0.18)',
                      boxShadow: i === active ? `0 0 12px ${s.accent}` : 'none',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold tabular-nums text-white/60">
                <span aria-hidden="true">{active + 1} / {SLIDES.length}</span>
                <span className="relative inline-flex h-7 w-7 items-center justify-center" title={paused ? 'Paused' : 'Auto-rotating every 5 seconds'}>
                  <svg viewBox="0 0 28 28" className="h-7 w-7 -rotate-90" aria-hidden="true">
                    <circle cx="14" cy="14" r={RING_R} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" />
                    {!reduced && !paused && (
                      <circle
                        key={active}
                        cx="14"
                        cy="14"
                        r={RING_R}
                        fill="none"
                        stroke={slide.accent}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={RING_C}
                        className="hero-anim hero-ring"
                      />
                    )}
                  </svg>
                  <span className="sr-only">{paused ? 'Auto-rotation paused' : 'Next service in 5 seconds'}</span>
                </span>
              </div>
            </div>

            {/* Hover arrows */}
            <button
              onClick={prev}
              aria-label="Previous service"
              className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0b0f19]/90 text-white/80 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:opacity-100 group-hover:opacity-100 sm:inline-flex"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label="Next service"
              className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0b0f19]/90 text-white/80 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:opacity-100 group-hover:opacity-100 sm:inline-flex"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Mobile arrows (no hover on touch) */}
          <div className="mt-4 flex justify-center gap-3 sm:hidden">
            <button
              onClick={prev}
              aria-label="Previous service"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label="Next service"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
