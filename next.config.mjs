// const nextConfig = {
//   reactStrictMode: true,

//   // --- FIXED BLOCK FOR LOCAL LOGIN ---
//   allowedDevOrigins: [
//     'localhost:3000',
//     '127.0.0.1:3000',
//     '172.23.160.1:3000', // Corrected IP
//     '172.23.160.1'       // Corrected IP
//   ],
//   // -----------------------------------

//   images: {
//     dangerouslyAllowLocalIP: true,
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
//       { protocol: 'https', hostname: 'maps.googleapis.com' },
//       { protocol: 'https', hostname: 'maps.gstatic.com' },
//       { protocol: 'http', hostname: 'localhost', port: '3000' },
//       { protocol: 'http', hostname: '127.0.0.1', port: '3000' },
//       { protocol: 'http', hostname: '172.23.160.1', port: '3000' }, // Corrected IP
//       { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
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
//     return [];
//   },
// };





/**
 * Security Headers Configuration
 * Ensures Next.js allows loading assets from external sources and Vercel Blob storage.
 */
function buildSecurityHeaders() {
  const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http://localhost:3000 http://127.0.0.1:3000 https://*.public.blob.vercel-storage.com https://lh3.googleusercontent.com https://maps.googleapis.com https://maps.gstatic.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: http://localhost:3000 http://127.0.0.1:3000 https://*.public.blob.vercel-storage.com;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  return [
    {
      key: 'Content-Security-Policy',
      value: ContentSecurityPolicy,
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // --- FIXED BLOCK FOR LOCAL LOGIN ---
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '172.23.160.1:3000',
    '172.23.160.1',
  ],
  // -----------------------------------

  images: {
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '172.23.160.1',
        port: '3000',
        pathname: '/**',
      },
      // Vercel Blob patterns (supports both single & nested subdomain configurations)
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
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