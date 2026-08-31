/** @type {import('next').NextConfig} */
const securityHeaders = [
  // NOTE: tune CSP directives to match any third-party embeds you add
  // (e.g. Cal.com/Calendly iframe, analytics scripts) before going live.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "frame-src https://calendly.com https://*.calendly.com",
      "connect-src 'self' https://www.google-analytics.com",
    ].join('; '),
  },
  // HSTS: only enable once HTTPS is fully verified across the domain.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Apex -> www canonical redirect is handled at the DNS/host level on
      // most providers (Vercel domain settings). If you need an in-app
      // fallback, use middleware.ts (see project root) which also enforces
      // this. Add legacy path redirects below as needed, e.g.:
      // { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },
};

export default nextConfig;
