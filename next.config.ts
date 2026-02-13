import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Headers de cache para otimizar performance
  async headers() {
    return [
      {
        // Cache de longo prazo para arquivos estáticos (imagens, ícones)
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 ano
          },
        ],
      },
      {
        // Cache para fontes
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
