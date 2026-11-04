'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ymd } from '@/lib/date-field';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface DatePickerProps {
  value: string; // YYYY-MM-DD or ''
  onChange: (value: string) => void;
  required?: boolean;
}

function parse(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
}

export default function DatePicker({ value, onChange, required }: DatePickerProps) {
  const selected = parse(value);
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => ({
    year: (selected ?? today).getUTCFullYear(),
    month: (selected ?? today).getUTCMonth(),
  }));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const first = new Date(Date.UTC(view.year, view.month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();
  const todayStr = ymd(today.getFullYear(), today.getMonth(), today.getDate());

  function shift(delta: number) {
    const d = new Date(Date.UTC(view.year, view.month + delta, 1));
    setView({ year: d.getUTCFullYear(), month: d.getUTCMonth() });
  }

  const label = selected
    ? selected.toLocaleDateString(undefined, { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Pick a date';

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`flex w-full items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-left text-sm focus:border-brand focus:outline-none ${selected ? 'text-ink' : 'text-ink/50'}`}
        >
          <CalendarDays size={16} className="text-ink/50" />
          {label}
        </button>
        {selected && !required && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear date"
            className="rounded-xl border border-slate-300 px-2 text-ink/50 hover:bg-surface-off"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {/* Keeps native "required" validation without allowing typed input. */}
      {required && (
        <input tabIndex={-1} aria-hidden required value={value} onChange={() => {}} className="pointer-events-none absolute h-0 w-0 opacity-0" />
      )}

      {open && (
        <div role="dialog" aria-label="Choose date" className="absolute z-10 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="rounded-lg p-1 hover:bg-surface-off">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-ink">
              {first.toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', year: 'numeric' })}
            </span>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="rounded-lg p-1 hover:bg-surface-off">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1 font-medium text-ink/50">{d}</span>
            ))}
            {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const str = ymd(view.year, view.month, day);
              const isSelected = str === value;
              return (
                <button
                  key={str}
                  type="button"
                  onClick={() => {
                    onChange(str);
                    setOpen(false);
                  }}
                  className={`rounded-lg py-1.5 ${isSelected ? 'bg-brand font-semibold text-white' : str === todayStr ? 'border border-brand text-brand' : 'text-ink hover:bg-brand/10'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(todayStr);
              setOpen(false);
            }}
            className="mt-2 w-full rounded-lg py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
}
