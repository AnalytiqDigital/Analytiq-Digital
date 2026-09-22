// 'use client';

// import { useActionState } from 'react';
// import { useFormStatus } from 'react-dom';
// import { submitContactForm, type ContactFormState } from '@/app/contact/actions';
// import { services } from '@/lib/services-data';

// const initialState: ContactFormState = { status: 'idle' };

// const serviceOptions = [...services.map((s) => s.name), 'Not sure yet'];

// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
//       {pending ? 'Sending…' : 'Send message'}
//     </button>
//   );
// }

// export default function ContactForm() {
//   const [state, formAction] = useActionState(submitContactForm, initialState);

//   return (
//     <form action={formAction} className="space-y-5" noValidate>
//       {/* Honeypot field — hidden from real users via CSS, not display:none, to avoid some bot heuristics */}
//       <div className="absolute -left-[9999px]" aria-hidden="true">
//         <label htmlFor="company_website">Website</label>
//         <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
//       </div>

//       <div className="grid gap-5 sm:grid-cols-2">
//         <div>
//           <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
//             Name *
//           </label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             required
//             className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           />
//         </div>
//         <div>
//           <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
//             Email *
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             required
//             className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           />
//         </div>
//         <div>
//           <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
//             Phone
//           </label>
//           <input
//             id="phone"
//             name="phone"
//             type="tel"
//             className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           />
//         </div>
//         <div>
//           <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-ink">
//             Company
//           </label>
//           <input
//             id="company"
//             name="company"
//             type="text"
//             className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           />
//         </div>
//       </div>

//       <div>
//         <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink">
//           Service of interest
//         </label>
//         <select
//           id="service"
//           name="service"
//           className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           defaultValue="Not sure yet"
//         >
//           {serviceOptions.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-ink">
//           Budget range (optional)
//         </label>
//         <input
//           id="budget"
//           name="budget"
//           type="text"
//           placeholder="e.g. ₦300,000 – ₦600,000"
//           className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//         />
//       </div>

//       <div>
//         <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
//           Message *
//         </label>
//         <textarea
//           id="message"
//           name="message"
//           required
//           rows={5}
//           className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
//           placeholder="Tell us briefly what you're trying to fix or build."
//         />
//       </div>

//       <SubmitButton />

//       {state.status === 'success' && (
//         <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
//           {state.message || "Thanks — we'll get back to you within one business day."}
//         </p>
//       )}
//       {state.status === 'error' && (
//         <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {state.message}
//         </p>
//       )}
//     </form>
//   );
// }


'use client';

import { useState, useTransition } from 'react';
import { submitContactForm, type ContactFormState } from '@/app/contact/actions';
import { services } from '@/lib/services-data';

const serviceOptions = [...services.map((s) => s.name), 'Not sure yet'];

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ContactFormState>({ status: 'idle' });

  // Form input states to bypass native HTML validation blocking
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('Not sure yet');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill out Name, Email, and Message.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('company', company);
    formData.append('service', service);
    formData.append('budget', budget);
    formData.append('message', message);

    startTransition(async () => {
      try {
        const result = await submitContactForm(state, formData);
        setState(result);

        if (result.status === 'success') {
          setName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setMessage('');
          setBudget('');
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
    <form onSubmit={handleManualSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-800">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-800">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="+234..."
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-slate-800">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-800">
          Service of interest
        </label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
        >
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-slate-800">
          Budget range (optional)
        </label>
        <input
          id="budget"
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. ₦300,000 – ₦600,000"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-800">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
          placeholder="Tell us briefly what you're trying to fix or build."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>

      {state.status === 'success' && (
        <p role="status" className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-800">
          {state.message || "Thanks — we'll get back to you within one business day."}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
    </form>
  );
}