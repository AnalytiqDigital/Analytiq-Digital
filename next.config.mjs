//** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

function buildSecurityHeaders() {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDev && "'unsafe-eval'",
    'https://www.googletagmanager.com',
    'https://assets.calendly.com',
    'https://vercel.live',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        `script-src ${scriptSrc}`,
        "style-src 'self' 'unsafe-inline'",
        // FIX 1: Allow http images only during local development
        isDev ? "img-src 'self' data: https: http:" : "img-src 'self' data: https:",
        "font-src 'self' data:",
        "frame-src https://calendly.com https://*.calendly.com https://vercel.live",
        "connect-src 'self' https://www.google-analytics.com https://vercel.live wss://vercel.live",
      ].join('; '),
    },
    !isDev && {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ].filter(Boolean);
}

const nextConfig = {
  reactStrictMode: true,

  // --- FIXED BLOCK FOR LOCAL LOGIN ---
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '172.21.48.1:3000',
    '172.21.48.1'
  ],
  // -----------------------------------

  images: {
    // FIX: Tells Next.js to calm down about the local network IP
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'maps.gstatic.com' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3000' },
      { protocol: 'http', hostname: '172.21.48.1', port: '3000' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: buildSecurityHeaders(),
      },
    ];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;