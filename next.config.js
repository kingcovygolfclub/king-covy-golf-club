/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net'],
  },
  trailingSlash: false,
  // Add aggressive cache busting with version identifier
  generateBuildId: async () => {
    return `v4-ssr-${Date.now()}`
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
