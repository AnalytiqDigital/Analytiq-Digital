import { whatsappLink, defaultWhatsappMessage } from '@/lib/site-config';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(defaultWhatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-soft transition hover:scale-105"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.86 9.86 0 0 0 4.62 1.15h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.87 14.05c-.25.7-1.24 1.28-2.02 1.44-.55.11-1.26.2-3.63-.76-3.04-1.24-4.99-4.32-5.15-4.52-.15-.2-1.23-1.64-1.23-3.13s.77-2.22 1.05-2.52c.25-.27.55-.34.73-.34h.53c.17 0 .4-.03.62.47.25.6.85 2.08.92 2.23.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.3.38-.44.51-.15.15-.3.3-.13.6.17.3.77 1.27 1.66 2.06 1.14 1.02 2.1 1.34 2.4 1.5.3.15.47.13.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.65-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
      </svg>
    </a>
  );
}
