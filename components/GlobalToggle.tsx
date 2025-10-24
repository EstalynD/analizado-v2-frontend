'use client';

import { useState, useEffect } from 'react';

export default function GlobalToggle() {
  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchGlobalStatus();
  }, []);

  const fetchGlobalStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/global`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGlobalDisabled(data.globalDisabled);
      }
    } catch (error) {
      console.error('Error obteniendo estado global:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/global`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ globalDisabled: !globalDisabled }),
      });

      if (response.ok) {
        setGlobalDisabled(!globalDisabled);
      }
    } catch (error) {
      console.error('Error actualizando estado global:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Control Global
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium">
            {globalDisabled 
              ? 'Todos los analizadores están desactivados' 
              : 'Los analizadores están activos'
            }
          </p>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={updating}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            globalDisabled ? 'bg-red-600' : 'bg-slate-300'
          } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
              globalDisabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className={`mt-4 p-4 rounded-lg border-2 ${
        globalDisabled 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            globalDisabled ? 'bg-red-500' : 'bg-green-500'
          }`}></div>
          <span className={`text-sm font-bold ${
            globalDisabled ? 'text-red-800' : 'text-green-800'
          }`}>
            {globalDisabled ? 'DESACTIVADO' : 'ACTIVO'}
          </span>
        </div>
      </div>
    </div>
  );
}
