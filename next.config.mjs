/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep local production builds separate from the development server.
  distDir: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? '.next-build' : '.next',
};

export default nextConfig;
