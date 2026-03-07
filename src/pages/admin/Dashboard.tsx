import { Link } from "react-router-dom";
import { BarChart, Users, Package, ShoppingCart, ArrowRight, UserPlus, Armchair } from "lucide-react";
import { StatsCards } from "../../components/vendedor/StatsCards";

export const Dashboard = () => {
    // Datos mock para el ejemplo (versión Administrador)
    const stats = [
        { title: "Ventas Globales", value: "₲ 5.250.000", subtitle: "+25% vs mes anterior", icon: BarChart, trend: "up" as const },
        { title: "Pedidos Totales", value: "24", subtitle: "Activos en el sistema", icon: ShoppingCart, trend: "neutral" as const },
        { title: "Usuarios Registrados", value: "45", subtitle: "3 nuevos hoy", icon: Users, trend: "up" as const },
    ];

    const pedidosRecientes = [
        { id: "#PED-003", cliente: "Carlos Ruiz", total: "₲ 3.200.000", estado: "En Proceso", color: "warning", vendedor: "Admin" },
        { id: "#PED-002", cliente: "María García", total: "₲ 450.000", estado: "Pendiente", color: "warning", vendedor: "Maria Vendedor" },
        { id: "#PED-001", cliente: "Juan Pérez", total: "₲ 1.500.000", estado: "Entregado", color: "success", vendedor: "Admin" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel Principal Administrador</h2>

            {/* Tarjetas de Estadísticas */}
            <StatsCards stats={stats} />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Gráfico de Ventas (Mock) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas Globales (Últimos 7 Días)</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 70, 55, 90, 60, 100, 110].map((height, i) => (
                            <div key={i} className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${height}%` }}>
                                <div className="w-full bg-primary rounded-t-sm" style={{ height: `${height * 0.8}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                    </div>
                </div>

                {/* Accesos Rápidos */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h3>
                        <div className="space-y-3">
                            <Link to="/admin/usuarios" className="w-full flex items-center justify-between p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <div className="flex items-center gap-3">
                                    <UserPlus size={20} />
                                    <span className="font-medium">Gestionar Usuarios</span>
                                </div>
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/admin/productos" className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Armchair size={20} />
                                    <span className="font-medium">Inventario Global</span>
                                </div>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Pedidos Recientes */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Últimos Pedidos</h3>
                            <Link to="/admin/pedidos" className="text-sm text-primary hover:underline">Ver todos</Link>
                        </div>

                        <div className="space-y-4">
                            {pedidosRecientes.map((pedido) => (
                                <div key={pedido.id} className="flex flex-col p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900">{pedido.cliente}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${pedido.color === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {pedido.estado}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">{pedido.id} • {pedido.total}</p>
                                        <Link to={`/admin/pedidos`} className="text-xs text-primary hover:underline">Ver detalle</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
