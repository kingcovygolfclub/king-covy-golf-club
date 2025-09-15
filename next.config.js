/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'king-covy-assets.s3.amazonaws.com', 'main.d101xso6am1gh0.amplifyapp.com'],
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
