/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com', 'your-cloudfront-domain.cloudfront.net'],
  },
}

module.exports = nextConfig
