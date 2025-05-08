import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // async rewrites() {
    // return process.env.NEXT_PUBLIC_PROXY_API === 'true'
    //   ? [
    //       {
    //         source: '/api/:path*',
    //         destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
    //       },
    //     ]
    //   : [];
  // },
};

export default nextConfig;
