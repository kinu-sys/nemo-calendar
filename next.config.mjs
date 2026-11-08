/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep production builds from overwriting a running development server.
  distDir: process.env.NODE_ENV === 'development' ? '.next' : '.next-build',
};

export default nextConfig;
