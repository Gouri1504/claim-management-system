/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable SPA-like client-side routing
  experimental: {
    scrollRestoration: true,
  }
};

module.exports = nextConfig;