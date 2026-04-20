const nextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_API_BASE_URL && (() => {
        try {
          const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
          return {
            protocol: apiUrl.protocol.slice(0, -1),
            hostname: apiUrl.hostname,
            port: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
            pathname: '/**',
          };
        } catch (e) {
          return null;
        }
      })() ? [(() => {
        const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
        return {
          protocol: apiUrl.protocol.slice(0, -1),
          hostname: apiUrl.hostname,
          port: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
          pathname: '/**',
        };
      })()] : []),
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;