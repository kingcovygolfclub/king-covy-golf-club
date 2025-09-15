/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net'],
    unoptimized: true
  },
  trailingSlash: false,
  // Add aggressive cache busting with version identifier
  generateBuildId: async () => {
    return `v3-admin-${Date.now()}`
  },
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
