/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net'],
  },
  trailingSlash: false,
  // Add cache busting to force new builds
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
