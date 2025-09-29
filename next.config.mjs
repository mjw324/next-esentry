/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
    assetPrefix: process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : "",
    transpilePackages: ['@mjw324/prisma-shared'],
    experimental: {
      useCache: true, // Enable "use cache" directive for Better Auth performance
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/a/**',
        },
      ],
    },
  };


export default nextConfig;
