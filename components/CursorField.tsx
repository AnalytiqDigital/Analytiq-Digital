'use client';

import { useEffect, useRef } from 'react';

interface TrailDot {
  x: number;
  y: number;
  age: number;
}

/**
 * Magnetic cursor with intelligent trail.
 * A small cyan ring follows the pointer with heavy, weighted easing;
 * it widens and brightens near interactive elements (a, button,
 * [data-magnetic]). The dot-trail intensifies with pointer velocity.
 * Fine-pointer devices only; never renders on touch; off on reduced motion.
 */
export default function CursorField() {
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!ring || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let last = { x: -100, y: -100 };
    let nearInteractive = false;
    let visible = false;
    const trail: TrailDot[] = [];
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        last = { ...pos };
        ring.style.opacity = '1';
      }
      const t = e.target as HTMLElement | null;
      nearInteractive = !!t?.closest?.('a, button, [data-magnetic]');
    };
    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
    };

    const frame = () => {
      if (!running) return;

      // Heavy weighted follow — slow, expensive-feeling
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      const scale = nearInteractive ? 1.9 : 1;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor = nearInteractive ? 'rgba(155,255,106,0.9)' : 'rgba(48,231,255,0.65)';

      // Trail: spawn rate follows velocity
      const dx = pos.x - last.x;
      const dy = pos.y - last.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      last = { ...pos };
      if (visible && speed > 0.5) {
        const n = Math.min(3, 1 + Math.floor(speed / 14));
        for (let i = 0; i < n; i++) {
          trail.push({ x: pos.x, y: pos.y, age: 0 });
        }
      }
      if (trail.length > 220) trail.splice(0, trail.length - 220);

      ctx.clearRect(0, 0, w, h);
      for (let i = trail.length - 1; i >= 0; i--) {
        const dot = trail[i];
        dot.age += 1;
        const life = 1 - dot.age / 42;
        if (life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        dot.y -= 0.25;
        const cyan = nearInteractive ? '155,255,106' : '48,231,255';
        ctx.fillStyle = `rgba(${cyan},${(life * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.6 * life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] hidden h-full w-full [@media(pointer:fine)]:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-7 w-7 rounded-full opacity-0 transition-[border-color,opacity] duration-300 [@media(pointer:fine)]:block"
        style={{ border: '1.5px solid rgba(48,231,255,0.65)', boxShadow: '0 0 18px rgba(48,231,255,0.25)' }}
      />
    </>
  );
}
