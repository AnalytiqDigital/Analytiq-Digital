// /** @type {import('next').NextConfig} */
// const isDev = process.env.NODE_ENV !== 'production';

// function buildSecurityHeaders() {
//   // Next's dev server (and Turbopack's HMR/React Refresh in particular)
//   // relies on eval() for source-mapped stack traces and fast refresh. That
//   // only ever runs in development — Next never uses eval() in a production
//   // build — so 'unsafe-eval' is added to script-src ONLY when NODE_ENV
//   // isn't 'production'. If you see a CSP eval() console error while
//   // running `npm run dev`, it means this file isn't picking up
//   // NODE_ENV=development correctly; it should never appear when running
//   // `npm run build && npm run start` or in a real Vercel deployment.
//   const scriptSrc = [
//     "'self'",
//     "'unsafe-inline'",
//     isDev && "'unsafe-eval'",
//     'https://www.googletagmanager.com',
//     'https://assets.calendly.com',
//   ]
//     .filter(Boolean)
//     .join(' ');

//   return [
//     // NOTE: tune CSP directives to match any third-party embeds you add
//     // (e.g. Cal.com/Calendly iframe, analytics scripts) before going live.
//     {
//       key: 'Content-Security-Policy',
//       value: [
//         "default-src 'self'",
//         `script-src ${scriptSrc}`,
//         "style-src 'self' 'unsafe-inline'",
//         "img-src 'self' data: https:",
//         "font-src 'self' data:",
//         "frame-src https://calendly.com https://*.calendly.com",
//         "connect-src 'self' https://www.google-analytics.com",
//       ].join('; '),
//     },
//     // HSTS: only enable once HTTPS is fully verified across the domain.
//     // Harmless in dev since browsers only honor it over a real HTTPS
//     // connection, but excluded there anyway to keep local http:// clean.
//     !isDev && {
//       key: 'Strict-Transport-Security',
//       value: 'max-age=63072000; includeSubDomains; preload',
//     },
//     { key: 'X-Content-Type-Options', value: 'nosniff' },
//     { key: 'X-Frame-Options', value: 'DENY' },
//     { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
//     { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
//   ].filter(Boolean);
// }

// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
//       { protocol: 'https', hostname: 'maps.googleapis.com' },
//       { protocol: 'https', hostname: 'maps.gstatic.com' },
//     ],
//   },
//   async headers() {
//     return [
//       {
//         source: '/:path*',
//         headers: buildSecurityHeaders(),
//       },
//     ];
//   },
//   async redirects() {
//     return [
//       // Apex -> www canonical redirect is handled at the DNS/host level on
//       // most providers (Vercel domain settings). If you need an in-app
//       // fallback, use middleware.ts (see project root) which also enforces
//       // this. Add legacy path redirects below as needed, e.g.:
//       // { source: '/old-page', destination: '/new-page', permanent: true },
//     ];
//   },
// };

// export default nextConfig;



//** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

function buildSecurityHeaders() {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDev && "'unsafe-eval'",
    'https://www.googletagmanager.com',
    'https://assets.calendly.com',
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
        "frame-src https://calendly.com https://*.calendly.com",
        "connect-src 'self' https://www.google-analytics.com",
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