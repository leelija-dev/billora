const nextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // Add production API domain
      {
        protocol: 'https',
        hostname: 'api.thefastbill.com',
        port: '',
        pathname: '/**',
      },
      // Add production API URL if configured (dynamic)
      ...(process.env.NEXT_PUBLIC_API_URL && (() => {
        try {
          const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
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
        const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
        return {
          protocol: apiUrl.protocol.slice(0, -1),
          hostname: apiUrl.hostname,
          port: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
          pathname: '/**',
        };
      })()] : []),
      // Add placeholder domains
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