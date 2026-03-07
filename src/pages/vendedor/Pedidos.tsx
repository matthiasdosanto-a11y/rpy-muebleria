import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/vendedor/SearchBar";
import { Filters } from "../../components/vendedor/Filters";
import { Eye, Edit } from "lucide-react";

export const Pedidos = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const statusOptions = [
        { label: "Pendiente", value: "Pendiente" },
        { label: "En Proceso", value: "Proceso" },
        { label: "Completado", value: "Completado" },
    ];

    const pedidosMock = [
        { id: "#123", cliente: "Juan Pérez", fecha: "20/03/2024", total: "₲ 450.000", estado: "Pendiente", vendedor: "Carlos" },
        { id: "#124", cliente: "María García", fecha: "20/03/2024", total: "₲ 890.000", estado: "Completado", vendedor: "Ana" },
        { id: "#125", cliente: "Roberto Gómez", fecha: "19/03/2024", total: "₲ 1.250.000", estado: "En Proceso", vendedor: "Carlos" },
    ];

    const filteredPedidos = pedidosMock.filter(p => {
        const matchesSearch = p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? p.estado.includes(statusFilter) : true;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pendiente": return "bg-amber-100 text-amber-700";
            case "En Proceso": return "bg-blue-100 text-blue-700";
            case "Completado": return "bg-emerald-100 text-emerald-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-96">
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por cliente o N° de pedido..."
                    />
                </div>
                <div className="w-full sm:w-auto flex gap-4">
                    <Filters
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                    <Link to="/vendedor/pedidos/nuevo" className="bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                        + Nuevo Pedido
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary -mb-px">
                    Todos los Pedidos
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent -mb-px">
                    Mis Pedidos
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">N° Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Vendedor</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPedidos.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{pedido.id}</td>
                                    <td className="px-6 py-4 text-gray-700">{pedido.cliente}</td>
                                    <td className="px-6 py-4 text-gray-600">{pedido.fecha}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{pedido.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(pedido.estado)}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{pedido.vendedor}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link to={`/vendedor/pedidos/${pedido.id.replace('#', '')}`} className="p-2 text-gray-500 hover:text-primary transition-colors bg-white hover:bg-primary/10 rounded-lg border border-gray-200" title="Ver detalle">
                                                <Eye size={16} />
                                            </Link>
                                            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 rounded-lg border border-gray-200" title="Editar estado">
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPedidos.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No se encontraron pedidos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
