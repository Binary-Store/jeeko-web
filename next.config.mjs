/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ullas-pcpl.s3.ap-south-1.amazonaws.com', // Your S3 bucket hostname
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
