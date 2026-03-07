import { useState } from "react";
import { Search, History, Download } from "lucide-react";
import { useLogs } from "../../hooks/useLogs";

export const Historial = () => {
    const { logs } = useLogs();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = logs.filter(log =>
        log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detalles.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <History size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bitácora de Administrador</h2>
                        <p className="text-sm text-gray-500">Historial de acciones registradas y protegidas por contraseña.</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", `rpy_historial_${new Date().toISOString().split('T')[0]}.json`);
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                    }}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download size={20} />
                    <span>Exportar Historial</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar usuario, acción o detalle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Fecha y Hora</th>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Acción Realizada</th>
                                <th className="px-6 py-4 min-w-[300px]">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No hay registros de acciones autorizadas todavía.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(log.fecha).toLocaleString('es-PY')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{log.usuario}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {log.accion}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-normal break-words max-w-lg">
                                            {log.detalles}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
