'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/app/contact/actions';
import { services } from '@/lib/services-data';

const initialState: ContactFormState = { status: 'idle' };

const serviceOptions = [...services.map((s) => s.name), 'Not sure yet'];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users via CSS, not display:none, to avoid some bot heuristics */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_website">Website</label>
        <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-ink">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink">
          Service of interest
        </label>
        <select
          id="service"
          name="service"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          defaultValue="Not sure yet"
        >
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-ink">
          Budget range (optional)
        </label>
        <input
          id="budget"
          name="budget"
          type="text"
          placeholder="e.g. ₦300,000 – ₦600,000"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
          placeholder="Tell us briefly what you're trying to fix or build."
        />
      </div>

      <SubmitButton />

      {state.status === 'success' && (
        <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          {state.message || "Thanks — we'll get back to you within one business day."}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
    </form>
  );
}
