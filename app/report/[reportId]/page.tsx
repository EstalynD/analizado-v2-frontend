'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  server_name: string;
  server_location: string;
  timestamp: string;
}

interface HardwareInfo {
  cpu: {
    brand: string;
    cores_physical: number;
    cores_logical: number;
    frequency_mhz: number;
  };
  ram: {
    total_gb: number;
    used_gb: number;
    available_gb: number;
    usage_percent: number;
  };
  gpu: Array<{
    vendor: string;
    name: string;
  }>;
  disks: Array<{
    mount_point: string;
    disk_type: string;
    total_gb: number;
    available_gb: number;
  }>;
  os_info: {
    name: string;
    version: string;
    hostname: string;
  };
  cameras: Array<{
    name: string;
    description: string;
    available: boolean;
    resolutions: string[];
  }>;
}

interface StreamingAnalysis {
  overall_score: number;
  overall_rating: string;
  streaming_capability: string;
  recommendations: Array<{
    component: string;
    title: string;
    priority: string;
    description?: string;
    message?: string;
    specific_upgrade?: string;
    benefit?: string;
    action_required?: boolean;
  }>;
  component_scores?: {
    cpu?: { score: number; category: string };
    ram?: { score: number; category: string };
    gpu?: { score: number; category: string };
    storage?: { score: number; category: string };
    internet?: { score: number; category: string };
  };
}

export default function ReportPage() {
  const params = useParams();
  const reportId = params?.reportId as string;
  
  const [report, setReport] = useState<{
    speedTestResult: SpeedTestResult;
    hardwareInfo: HardwareInfo;
    streamingAnalysis: StreamingAnalysis;
    createdAt: string;
    expiresAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3070/api';
        const response = await fetch(`${apiUrl}/reports/${reportId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cargar el reporte');
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error('Error cargando reporte:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const formatBytes = (gb: number) => {
    return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(gb * 1024).toFixed(0)} MB`;
  };

  const formatSpeed = (mbps: number) => {
    return mbps >= 1 ? `${mbps.toFixed(2)} Mbps` : `${(mbps * 1000).toFixed(0)} Kbps`;
  };

  const getScoreColor = (rating: string) => {
    const colors: Record<string, string> = {
      'INSUFICIENTE': '#ef4444',
      'BÁSICO': '#f59e0b',
      'ÓPTIMO': '#10b981',
      'EXCELENTE': '#3b82f6'
    };
    return colors[rating] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-bold mb-4">Reporte no disponible</h1>
          <p className="text-gray-300 mb-6">{error || 'El reporte solicitado no existe o ha expirado'}</p>
          <p className="text-gray-400 text-sm">Los reportes expiran después de 3 días</p>
        </div>
      </div>
    );
  }

  const { speedTestResult, hardwareInfo, streamingAnalysis } = report;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            JC Revisión de Rendimiento
          </h1>
          <p className="text-gray-300">Reporte de Análisis de Equipo</p>
          <p className="text-gray-400 text-sm mt-2">
            Generado el {new Date(report.createdAt).toLocaleString('es-ES')}
          </p>
        </div>

        {/* Score Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-white/10"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-blue-500"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * streamingAnalysis.overall_score) / 100}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold">{streamingAnalysis.overall_score}%</div>
                <div 
                  className="text-xl font-semibold mt-2"
                  style={{ color: getScoreColor(streamingAnalysis.overall_rating) }}
                >
                  {streamingAnalysis.overall_rating}
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Capacidad de Streaming</h2>
              <p className="text-xl text-blue-400 mb-4">{streamingAnalysis.streaming_capability}</p>
              <p className="text-gray-300 max-w-md">
                Este reporte muestra el análisis completo del rendimiento del equipo, incluyendo
                velocidad de internet, hardware y capacidad para streaming.
              </p>
            </div>
          </div>
        </div>

        {/* Speed Test Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🌐 Velocidad de Internet
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{formatSpeed(speedTestResult.download)}</div>
              <div className="text-gray-300 mt-1">Descarga</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{formatSpeed(speedTestResult.upload)}</div>
              <div className="text-gray-300 mt-1">Subida</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{speedTestResult.ping?.toFixed(0) || 0} ms</div>
              <div className="text-gray-300 mt-1">Ping</div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            📍 Servidor: {speedTestResult.server_name || 'N/A'}
          </div>
        </div>

        {/* Hardware Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* CPU */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🖥️ Procesador
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Modelo</span>
                <span className="font-semibold">{hardwareInfo.cpu?.brand || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Núcleos</span>
                <span className="font-semibold">
                  {hardwareInfo.cpu?.cores_physical || 0} físicos / {hardwareInfo.cpu?.cores_logical || 0} lógicos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Frecuencia</span>
                <span className="font-semibold">
                  {hardwareInfo.cpu?.frequency_mhz ? (hardwareInfo.cpu.frequency_mhz / 1000).toFixed(2) : '0'} GHz
                </span>
              </div>
            </div>
          </div>

          {/* RAM */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              💾 Memoria RAM
            </h3>
            <div className="mb-4">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${hardwareInfo.ram?.usage_percent || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Total</span>
                <span className="font-semibold">{formatBytes(hardwareInfo.ram?.total_gb || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">En uso</span>
                <span className="font-semibold">
                  {formatBytes(hardwareInfo.ram?.used_gb || 0)} ({hardwareInfo.ram?.usage_percent?.toFixed(1) || 0}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Disponible</span>
                <span className="font-semibold">{formatBytes(hardwareInfo.ram?.available_gb || 0)}</span>
              </div>
            </div>
          </div>

          {/* GPU */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🎮 Tarjeta Gráfica
            </h3>
            {hardwareInfo.gpu && hardwareInfo.gpu.length > 0 ? (
              <div className="space-y-3">
                {hardwareInfo.gpu.map((gpu, idx) => (
                  <div key={idx}>
                    <div className="text-sm text-gray-300">{gpu.vendor}</div>
                    <div className="font-semibold">{gpu.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No se detectaron GPUs dedicadas</p>
            )}
          </div>

          {/* Storage */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              💿 Almacenamiento
            </h3>
            {hardwareInfo.disks && hardwareInfo.disks.length > 0 ? (
              <div className="space-y-4">
                {hardwareInfo.disks.map((disk, idx) => {
                  const usedPercent = ((disk.total_gb - disk.available_gb) / disk.total_gb) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{disk.mount_point}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          disk.disk_type.includes('SSD') 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {disk.disk_type}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: `${usedPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {formatBytes(disk.total_gb - disk.available_gb)} / {formatBytes(disk.total_gb)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic">No se detectaron discos</p>
            )}
          </div>

          {/* OS */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⚙️ Sistema Operativo
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Sistema</span>
                <span className="font-semibold">{hardwareInfo.os_info?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Versión</span>
                <span className="font-semibold">{hardwareInfo.os_info?.version || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Equipo</span>
                <span className="font-semibold">{hardwareInfo.os_info?.hostname || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Camera */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📷 Cámaras
            </h3>
            {hardwareInfo.cameras && hardwareInfo.cameras.filter(c => c.available).length > 0 ? (
              <div className="space-y-3">
                {hardwareInfo.cameras.filter(c => c.available).map((camera, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-3 last:border-0">
                    <div className="font-semibold mb-1">{camera.name}</div>
                    {camera.description && camera.description !== camera.name && (
                      <div className="text-sm text-gray-300 mb-2">{camera.description}</div>
                    )}
                    {camera.resolutions && camera.resolutions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {camera.resolutions.map((res, rIdx) => (
                          <span 
                            key={rIdx}
                            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No se detectaron cámaras</p>
            )}
          </div>
        </div>

        {/* Recommendations - Mostrar TODAS las recomendaciones */}
        {streamingAnalysis.recommendations && streamingAnalysis.recommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-2xl font-bold mb-4">💡 Recomendaciones</h3>
            <p className="text-gray-400 text-sm mb-6">
              Análisis detallado de cada componente del equipo para streaming
            </p>
            <div className="space-y-4">
              {streamingAnalysis.recommendations.map((rec, idx) => {
                const priorityColors: Record<string, string> = {
                  'CRÍTICA': 'bg-red-500/20 text-red-300 border-red-500/30',
                  'ALTA': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                  'MEDIA': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
                  'BAJA': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  'NINGUNA': 'bg-green-500/20 text-green-300 border-green-500/30'
                };
                
                const getComponentIcon = (component: string) => {
                  const icons: Record<string, string> = {
                    'CPU': '🖥️',
                    'RAM': '💾',
                    'GPU': '🎮',
                    'Almacenamiento': '💿',
                    'Internet': '🌐'
                  };
                  return icons[component] || '⚙️';
                };

                // Obtener score del componente si está disponible
                // Los component_scores pueden tener diferentes formatos de key
                const componentKey = rec.component.toLowerCase();
                const componentScore = streamingAnalysis.component_scores
                  ? (streamingAnalysis.component_scores as any)[componentKey]?.score ||
                    (streamingAnalysis.component_scores as any)[rec.component]?.score ||
                    (streamingAnalysis.component_scores as any)[componentKey.charAt(0).toUpperCase() + componentKey.slice(1)]?.score
                  : null;
                const componentCategory = streamingAnalysis.component_scores
                  ? (streamingAnalysis.component_scores as any)[componentKey]?.category ||
                    (streamingAnalysis.component_scores as any)[rec.component]?.category ||
                    (streamingAnalysis.component_scores as any)[componentKey.charAt(0).toUpperCase() + componentKey.slice(1)]?.category
                  : null;

                return (
                  <div 
                    key={idx}
                    className={`p-5 rounded-lg border-2 ${priorityColors[rec.priority] || priorityColors['BAJA']} transition-all hover:shadow-lg`}
                  >
                    {/* Header con componente y score */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getComponentIcon(rec.component)}</div>
                        <div>
                          <div className="font-bold text-lg">{rec.component}</div>
                          {componentScore !== null && (
                            <div className="text-sm text-gray-300">
                              {componentScore}% rendimiento
                              {componentCategory && (
                                <span className="ml-2 px-2 py-0.5 rounded text-xs bg-white/10">
                                  {componentCategory}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded font-semibold ${
                        rec.priority === 'NINGUNA' ? 'bg-green-500/30 text-green-300' : 'bg-white/10'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>

                    {/* Título y mensaje principal */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-base mb-2">{rec.title}</h4>
                      {(rec.message || rec.description) && (
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {rec.message || rec.description}
                        </p>
                      )}
                    </div>

                    {/* Información adicional */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                      {rec.specific_upgrade && (
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 font-medium min-w-[120px]">Upgrade recomendado:</span>
                          <span className="text-gray-300">{rec.specific_upgrade}</span>
                        </div>
                      )}
                      {rec.benefit && (
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 font-medium min-w-[120px]">Beneficio:</span>
                          <span className="text-gray-300">{rec.benefit}</span>
                        </div>
                      )}
                      {rec.action_required && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                          <span className="text-lg">⚠️</span>
                          <span className="text-sm text-red-300 font-medium">
                            Acción requerida para streaming estable
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-8 pt-6 border-t border-white/10">
          <p>Desarrollado por JC Studios</p>
          <a 
            href="https://www.jcstudios.com.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            www.jcstudios.com.co
          </a>
          <p className="mt-2">
            Este reporte expira el {new Date(report.expiresAt).toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}

