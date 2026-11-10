'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * CinematicReveal — slow, heavy scroll entrance.
 * Fades + rises with a long expo-out curve and slight de-blur,
 * so sections arrive like a camera move rather than a pop.
 * `as` allows semantic tags; `delay` staggers siblings intentionally.
 */
export default function CinematicReveal({
  children,
  delay = 0,
  y = 36,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'li' | 'figure' | 'blockquote';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        filter: visible ? 'blur(0px)' : 'blur(6px)',
        transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform, filter',
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * StaggerWords — cinematic headline treatment.
 * Splits text into words and reveals each with intentional,
 * slightly accelerating timing and a rise + de-blur + faint
 * cyan glow that settles. Depth comes from the per-word lag.
 */
export function StaggerWords({
  text,
  className = '',
  baseDelay = 120,
  step = 85,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  step?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    // Headline is above the fold — begin almost immediately for impact.
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) rotateX(0deg)' : 'translateY(0.55em) rotateX(-38deg)',
            filter: visible ? 'blur(0px)' : 'blur(8px)',
            textShadow: visible ? '0 0 0 rgba(48,231,255,0)' : 'none',
            transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * step}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * step}ms, filter 0.9s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * step}ms`,
            transformOrigin: '50% 100%',
            paddingRight: '0.24em',
            marginRight: '-0.24em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
