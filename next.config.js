/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net'],
  },
  trailingSlash: false,
  experimental: {
    appDir: true,
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
