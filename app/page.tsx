'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay token almacenado
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verificar si el token es válido haciendo una petición al backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
          if (response.ok) {
            router.push('/dashboard');
          } else {
            // Token inválido, limpiar y redirigir a login
            localStorage.removeItem('token');
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error verificando autenticación:', err);
        setError('Error de conexión con el servidor');
        // Redirigir a login en caso de error
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}
