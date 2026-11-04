'use client';

import { useState, useTransition } from 'react';
import { submitConsultationForm, type ConsultationFormState } from '@/app/book-a-consultation/actions';

const topicOptions = [
  'AI Automation / AI Agents',
  'WhatsApp Assistant',
  'Data Analytics / Power BI',
  'Website Development',
  'Custom Software / ERP',
  'Workflow & Process Automation',
  'Not sure yet',
];

const inputClass =
  'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-800';

export default function ConsultationForm() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ConsultationFormState>({ status: 'idle' });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('Not sure yet');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setState({
        status: 'error',
        message: 'Please fill in your name, email, and a short description of what you need.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('company', company);
    formData.append('topic', topic);
    formData.append('preferredTime', preferredTime);
    formData.append('message', message);

    startTransition(async () => {
      try {
        const result = await submitConsultationForm(state, formData);
        setState(result);

        if (result.status === 'success') {
          setName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setPreferredTime('');
          setMessage('');
        }
      } catch (err: unknown) {
        const error = err as Error;
        setState({
          status: 'error',
          message: error.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, catches bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="consult_company_website">Website</label>
        <input
          type="text"
          id="consult_company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="consult_name" className={labelClass}>
            Name *
          </label>
          <input
            id="consult_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your full name"
            maxLength={200}
          />
        </div>
        <div>
          <label htmlFor="consult_email" className={labelClass}>
            Email *
          </label>
          <input
            id="consult_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="your@email.com"
            maxLength={200}
          />
        </div>
        <div>
          <label htmlFor="consult_phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input
            id="consult_phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="+234..."
            maxLength={40}
          />
        </div>
        <div>
          <label htmlFor="consult_company" className={labelClass}>
            Company
          </label>
          <input
            id="consult_company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            placeholder="Company name"
            maxLength={200}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="consult_topic" className={labelClass}>
            What do you need help with?
          </label>
          <select
            id="consult_topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={inputClass}
          >
            {topicOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="consult_time" className={labelClass}>
            Preferred time for a call (optional)
          </label>
          <input
            id="consult_time"
            type="text"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className={inputClass}
            placeholder="e.g. Weekday mornings, or pick a slot on our calendar"
            maxLength={120}
          />
        </div>
      </div>

      <div>
        <label htmlFor="consult_message" className={labelClass}>
          Tell us briefly what you&apos;re trying to fix or build *
        </label>
        <textarea
          id="consult_message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="e.g. We spend hours every week copying orders from WhatsApp into a spreadsheet…"
          maxLength={2000}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {isPending ? 'Sending…' : 'Request Consultation'}
      </button>

      {state.status === 'success' && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
        >
          <p>{state.message || "Thanks — we'll get back to you within one business day."}</p>
          {state.whatsappUrl && (
            <a
              href={state.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
            >
              Continue on WhatsApp
            </a>
          )}
        </div>
      )}
      {state.status === 'error' && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
