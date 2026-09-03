import Image from 'next/image';
import type { ClientLogo } from '@/lib/clients-data';

const PLACEHOLDER_COUNT = 6;

export default function ClientLogoSlider({ clients }: { clients: ClientLogo[] }) {
  const hasClients = clients.length > 0;
  // Duplicate the list once so the marquee loop is seamless at -50% translate.
  const track = hasClients ? [...clients, ...clients] : [];

  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface-off to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface-off to-transparent" />

      {hasClients ? (
        <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]">
          {track.map((client, i) => (
            <div key={`${client.name}-${i}`} className="flex h-16 w-40 shrink-0 items-center justify-center">
              <Image
                src={client.logoUrl}
                alt={client.name}
                width={140}
                height={56}
                className="max-h-12 w-auto object-contain grayscale transition hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-xs font-medium text-ink/40"
            >
              Your Logo Here
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
