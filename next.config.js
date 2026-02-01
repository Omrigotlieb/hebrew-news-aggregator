/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ynet.co.il',
      },
      {
        protocol: 'https',
        hostname: '**.mako.co.il',
      },
      {
        protocol: 'https',
        hostname: '**.n12.co.il',
      },
    ],
  },
}

module.exports = nextConfig
