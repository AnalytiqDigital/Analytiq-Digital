'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number; // 0 = cyan, 1 = lime, 2 = violet
  pulse: number;
  pulseSpeed: number;
}

const COLORS = ['48,231,255', '155,255,106', '138,99,255'];

/**
 * Living Intelligence Layer: a soft neural particle field on canvas.
 * Particles drift, link when close, and react to mouse movement and
 * scroll velocity. Cyan = nervous system, lime = energy, violet = depth.
 *
 * Performance: capped particle count (density-based, mobile-safe),
 * single rAF loop, pauses off-screen and on reduced motion.
 */
export default function NeuralField({
  className = '',
  density = 1,
  interactive = true,
}: {
  className?: string;
  density?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Static faint dots for reduced motion — no animation loop at all.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const mouse = { x: -9999, y: -9999, active: false };
    let scrollBoost = 0;
    let heroBoost = 0;
    let lastScrollY = window.scrollY;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const small = w < 640;
      const base = small ? 28 : 70;
      const count = Math.round(base * density * (small ? 0.7 : 1));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.8 + Math.random() * 1.8,
        hue: Math.random() < 0.62 ? 0 : Math.random() < 0.6 ? 1 : 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.02,
      }));
    };

    const LINK_DIST = 130;

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const energy = Math.min(1, scrollBoost + heroBoost * 0.7);
      const speedMul = 1 + energy * 2.2;

      // Update
      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        p.x += p.vx * speedMul;
        p.y += p.vy * speedMul;

        // Gentle mouse repulsion — the field "notices" the cursor
        if (interactive && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const R = 150;
          if (d2 < R * R && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = ((R - d) / R) * 0.6;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * (0.10 + energy * 0.18);
            ctx.strokeStyle = `rgba(48,231,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const p of particles) {
        const glow = 0.45 + Math.sin(p.pulse) * 0.25 + energy * 0.3;
        ctx.fillStyle = `rgba(${COLORS[p.hue]},${Math.min(1, glow).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      scrollBoost *= 0.94;
      heroBoost *= 0.96;
      raf = requestAnimationFrame(frame);
    };

    const onMouseMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      // Particles intensify while the pointer is over hero surfaces.
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('[data-hero-field]')) {
        heroBoost = Math.min(1, heroBoost + 0.12);
      }
    };
    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onScroll = () => {
      const y = window.scrollY;
      scrollBoost = Math.min(1, scrollBoost + Math.abs(y - lastScrollY) / 220);
      lastScrollY = y;
    };
    const onVisibility = () => {
      const hidden = document.hidden;
      if (hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('pointermove', onMouseMove, { passive: true });
      canvas.addEventListener('pointerleave', onMouseLeave);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      // Paint one static frame, no loop.
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.fillStyle = `rgba(${COLORS[p.hue]},0.35)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMouseMove);
      canvas.removeEventListener('pointerleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
