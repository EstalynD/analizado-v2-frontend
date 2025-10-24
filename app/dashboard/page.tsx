'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlobalToggle from '@/components/GlobalToggle';
import CodeTable from '@/components/CodeTable';
import GenerateCodeModal from '@/components/GenerateCodeModal';

interface Code {
  _id: string;
  code: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCodes();
  }, [router]);

  const fetchCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/codes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCodes(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error obteniendo códigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newCode = await response.json();
        setCodes([newCode, ...codes]);
        setShowGenerateModal(false);
      }
    } catch (error) {
      console.error('Error generando código:', error);
    }
  };

  const handleToggleCode = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/codes/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setCodes(codes.map(code => 
          code._id === id ? { ...code, isActive } : code
        ));
      }
    } catch (error) {
      console.error('Error actualizando código:', error);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCodes(codes.filter(code => code._id !== id));
      }
    } catch (error) {
      console.error('Error eliminando código:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="text-slate-600 mt-2 font-medium">Gestiona los códigos de activación del analizador</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Toggle Global */}
          <div className="lg:col-span-1">
            <GlobalToggle />
          </div>

          {/* Códigos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Códigos de Activación</h2>
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Generar Nuevo Código
                    </div>
                  </button>
                </div>
              </div>
              
              <CodeTable
                codes={codes}
                onToggle={handleToggleCode}
                onDelete={handleDeleteCode}
              />
            </div>
          </div>
        </div>
      </div>

      {showGenerateModal && (
        <GenerateCodeModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateCode}
        />
      )}
    </div>
  );
}
