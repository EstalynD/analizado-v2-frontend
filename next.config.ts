import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para producción
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    domains: ['localhost', 'tu-app-backend.herokuapp.com'],
  },
  
  // Configuración de variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
