import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@daya-lite/shared'],

  // CORS for the mobile app (and any external REST client). All API routes
  // also accept Bearer tokens, so credentials are not needed in the request.
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
