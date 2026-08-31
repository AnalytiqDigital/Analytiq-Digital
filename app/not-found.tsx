import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mt-3 max-w-md text-ink/70">
        The page you&rsquo;re looking for may have moved or the link may be outdated. Try one of the links below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go to homepage
        </Link>
        <Link href="/services" className="btn-outline">
          View services
        </Link>
        <Link href="/contact" className="btn-outline">
          Contact
        </Link>
      </div>
    </section>
  );
}
