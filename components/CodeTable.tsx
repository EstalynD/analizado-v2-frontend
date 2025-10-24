'use client';

interface Code {
  _id: string;
  code: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

interface CodeTableProps {
  codes: Code[];
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export default function CodeTable({ codes, onToggle, onDelete }: CodeTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (codes.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No hay códigos generados</h3>
        <p className="text-slate-600 font-medium">Genera tu primer código para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Usos
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {codes.map((code) => (
            <tr key={code._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <code className="text-sm font-mono bg-slate-100 text-slate-800 px-3 py-2 rounded-lg border border-slate-200">
                    {code.code}
                  </code>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                  code.isActive 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {code.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                {code.usageCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                {formatDate(code.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  onClick={() => onToggle(code._id, !code.isActive)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 ${
                    code.isActive 
                      ? 'text-red-700 hover:text-red-900 hover:bg-red-50' 
                      : 'text-green-700 hover:text-green-900 hover:bg-green-50'
                  }`}
                >
                  {code.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => onDelete(code._id)}
                  className="text-red-700 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-lg font-semibold transition-all duration-200"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
