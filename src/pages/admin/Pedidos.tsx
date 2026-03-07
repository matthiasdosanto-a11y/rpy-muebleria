import { useState } from "react";
import { Search, Eye, Filter } from "lucide-react";

export const Pedidos = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const mockOrders = [
        { id: "PED-001", cliente: "Juan Pérez", fecha: "2023-10-25", total: "1500000", estado: "Entregado", vendedor: "Admin" },
        { id: "PED-002", cliente: "María García", fecha: "2023-10-26", total: "450000", estado: "Pendiente", vendedor: "Maria Vendedora" },
        { id: "PED-003", cliente: "Carlos Ruiz", fecha: "2023-10-27", total: "3200000", estado: "En Proceso", vendedor: "Admin" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Todos los Pedidos</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar pedido por ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
                        <Filter size={16} />
                        Filtros
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">ID Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Vendedor</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Total (Gs)</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-primary">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.cliente}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.vendedor}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.fecha}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{parseInt(order.total).toLocaleString('es-PY')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.estado === 'Entregado' ? 'bg-green-100 text-green-700' :
                                            order.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg" title="Ver detalle">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
