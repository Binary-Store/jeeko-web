/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jeeko-prod.s3.ap-south-1.amazonaws.com', // Your S3 bucket hostname
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
