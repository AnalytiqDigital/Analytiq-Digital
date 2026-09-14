const nextConfig = {
  reactStrictMode: true,

  // --- FIXED BLOCK FOR LOCAL LOGIN ---
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '172.23.160.1:3000', // Corrected IP
    '172.23.160.1'       // Corrected IP
  ],
  // -----------------------------------

  images: {
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'maps.gstatic.com' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3000' },
      { protocol: 'http', hostname: '172.23.160.1', port: '3000' }, // Corrected IP
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
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