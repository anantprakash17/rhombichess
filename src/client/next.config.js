/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/rules/:path*',
          destination: '/api/rules/:path*',
        },
      ];
    },
  };
  
  module.exports = nextConfig;
