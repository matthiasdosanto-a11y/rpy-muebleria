import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Users, Package, ShoppingCart, ArrowRight, PlusCircle, Armchair } from "lucide-react";
import { StatsCards } from "../../components/vendedor/StatsCards";

export const Dashboard = () => {
    // Datos mock para el ejemplo
    const stats = [
        { title: "Ventas Hoy", value: "₲ 1.250.000", subtitle: "+15% vs ayer", icon: BarChart, trend: "up" as const },
        { title: "Pedidos", value: "8", subtitle: "Pendientes", icon: ShoppingCart, trend: "neutral" as const },
        { title: "Clientes", value: "12", subtitle: "Atendidos", icon: Users, trend: "up" as const },
    ];

    const pedidosRecientes = [
        { id: "#a1b2c3", cliente: "Juan Pérez", total: "₲ 450.000", estado: "Pendiente", color: "warning" },
        { id: "#d4e5f6", cliente: "María García", total: "₲ 890.000", estado: "Completado", color: "success" },
    ];

    return (
        <div className="space-y-6">
            {/* Tarjetas de Estadísticas */}
            <StatsCards stats={stats} />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Gráfico de Ventas (Mock) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas Últimos 7 Días</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[30, 60, 45, 80, 50, 90, 100].map((height, i) => (
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
                            <Link to="/vendedor/pedidos/nuevo" className="w-full flex items-center justify-between p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                <div className="flex items-center gap-3">
                                    <PlusCircle size={20} />
                                    <span className="font-medium">Nuevo Pedido</span>
                                </div>
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/vendedor/productos" className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Armchair size={20} />
                                    <span className="font-medium">Ver Catálogo</span>
                                </div>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Pedidos Recientes */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Pedidos Recientes</h3>
                            <Link to="/vendedor/pedidos" className="text-sm text-primary hover:underline">Ver todos</Link>
                        </div>

                        <div className="space-y-4">
                            {pedidosRecientes.map((pedido) => (
                                <div key={pedido.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div>
                                        <h4 className="text-sm font-semibold">{pedido.cliente}</h4>
                                        <p className="text-xs text-gray-500">{pedido.id} - {pedido.total}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${pedido.color === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {pedido.estado}
                                        </span>
                                        <Link to={`/vendedor/pedidos/${pedido.id.replace('#', '')}`} className="text-xs text-primary hover:underline">Ver</Link>
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
