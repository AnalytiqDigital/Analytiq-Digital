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
 *
 * The animation loop only runs while the ring or trail is actually moving:
 * clearing a full-viewport canvas 60x/second while the pointer is idle was
 * the main source of visible lag across the site.
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
    let lastX = -100;
    let lastY = -100;
    let nearInteractive = false;
    let appliedNear: boolean | null = null;
    let visible = false;
    const trail: TrailDot[] = [];
    let raf = 0;
    let running = true;
    let canvasDirty = false;

    const schedule = () => {
 if (running && !raf) raf = requestAnimationFrame(frame);
 };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        lastX = pos.x;
        lastY = pos.y;
        ring.style.opacity = '1';
      }
      const t = e.target as HTMLElement | null;
      nearInteractive = !!t?.closest?.('a, button, [data-magnetic]');
      schedule();
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
      schedule();
    };

    const frame = () => {
    raf = 0;
      if (!running) return;

 // Heavy weighted follow — eased over frames, not through a CSS transition.
 const dx = pos.x - ringPos.x;
 const dy = pos.y - ringPos.y;
 const ringMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
 if (ringMoving) {
      ringPos.x += dx * 0.16;
      ringPos.y += dy * 0.16;
      }
      if (ringMoving || nearInteractive !== appliedNear) {
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${nearInteractive ? 1.9 : 1})`;
      ring.style.borderColor = nearInteractive ? 'rgba(155,255,106,0.9)' : 'rgba(48,231,255,0.65)';
      appliedNear = nearInteractive;
 }

 // Trail: spawn rate follows velocity.
 const vx = pos.x - lastX;
 const vy = pos.y - lastY;
      const speed = Math.sqrt(vx * vx + vy * vy);
      lastX = pos.x;
      lastY = pos.y;
      if (visible && speed > 0.5) {
        const n = Math.min(3, 1 + Math.floor(speed / 14));
        for (let i = 0; i < n; i++) {
          trail.push({ x: pos.x, y: pos.y, age: 0 });
        }
      }
      if (trail.length > 220) trail.splice(0, trail.length - 220);

 // Only touch the canvas when something is actually drawn on it.
      if (trail.length > 0 || canvasDirty) {
      ctx.clearRect(0, 0, w, h);
      const cyan = nearInteractive ? '155,255,106' : '48,231,255';
      for (let i = trail.length - 1; i >= 0; i--) {
        const dot = trail[i];
        dot.age += 1;
        const life = 1 - dot.age / 42;
        if (life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        dot.y -= 0.25;
        ctx.fillStyle = `rgba(${cyan},${(life * 0.55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.6 * life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      canvasDirty = trail.length > 0;
 }

 if (visible && (ringMoving || trail.length > 0)) schedule();
    };

 const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      raf = 0;
      } else {
        running = true;
        schedule();
      }
      };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
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
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-7 w-7 rounded-full opacity-0 transition-[opacity] duration-300 [@media(pointer:fine)]:block"
        style={{ border: '1.5px solid rgba(48,231,255,0.65)', boxShadow: '0 0 18px rgba(48,231,255,0.25)' }}
      />
    </>
  );
}
