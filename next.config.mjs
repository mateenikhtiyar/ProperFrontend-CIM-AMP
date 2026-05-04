/** @type {import('next').NextConfig} */
import nextBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
};
const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})
export default withBundleAnalyzer(nextConfig);
