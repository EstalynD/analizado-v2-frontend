'use client';

interface GenerateCodeModalProps {
  onClose: () => void;
  onGenerate: () => void;
}

export default function GenerateCodeModal({ onClose, onGenerate }: GenerateCodeModalProps) {
  const handleGenerate = () => {
    onGenerate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Generar Nuevo Código
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <p className="text-slate-600 mb-4 font-medium">
            Se generará un nuevo código de activación único que podrá ser usado múltiples veces.
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-blue-800">Información importante</h4>
                <p className="text-sm text-blue-700 mt-1 font-medium">
                  El código se generará automáticamente y estará activo por defecto. 
                  Podrás desactivarlo o eliminarlo desde la tabla principal.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Generar Código
          </button>
        </div>
      </div>
    </div>
  );
}
