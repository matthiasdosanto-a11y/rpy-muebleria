import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useChat } from "@/hooks/useChat";
import {
    LayoutDashboard,
    Users,
    Package,
    Armchair,
    MessageSquare,
    LogOut,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    PlusCircle,
    ListOrdered,
    History as HistoryIcon,
    Mail
} from "lucide-react";

export const AdminLayout = () => {
    const [email, setEmail] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPedidosOpen, setIsPedidosOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { getTotalUnreadCount } = useChat(email);
    const unreadCount = getTotalUnreadCount();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) setEmail(session.user.email);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/admin") return "Resumen";
        if (path.includes("/admin/usuarios")) return "Usuarios";
        if (path.includes("/admin/pedidos/nuevo")) return "Nuevo Pedido";
        if (path.includes("/admin/pedidos")) return "Pedidos";
        if (path.includes("/admin/productos")) return "Productos";
        if (path.includes("/admin/soporte")) return "Chat Interno";
        return "Panel Administrador";
    };

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <Link to="/admin" className="text-xl font-bold text-primary flex items-center gap-2">
                        RPY Mueblería
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-2">Admin</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin") && location.pathname === "/admin"
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Resumen</span>
                    </Link>

                    <Link
                        to="/admin/usuarios"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/usuarios")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Users size={20} />
                        <span>Usuarios</span>
                    </Link>

                    <Link
                        to="/admin/clientes"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/clientes")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Users size={20} />
                        <span>Clientes</span>
                    </Link>

                    <Link
                        to="/admin/productos"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/productos")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Armchair size={20} />
                        <span>Productos</span>
                    </Link>

                    {/* Menú desplegable de Pedidos */}
                    <div>
                        <button
                            onClick={() => setIsPedidosOpen(!isPedidosOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/pedidos")
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Package size={20} />
                                <span>Pedidos</span>
                            </div>
                            {isPedidosOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {isPedidosOpen && (
                            <div className="mt-1 ml-6 pl-3 border-l-2 border-gray-100 space-y-1">
                                <Link
                                    to="/admin/pedidos/nuevo"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/admin/pedidos/nuevo"
                                        ? "text-primary font-medium"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <PlusCircle size={16} />
                                    <span>Nuevo Pedido</span>
                                </Link>
                                <Link
                                    to="/admin/pedidos"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === "/admin/pedidos"
                                        ? "text-primary font-medium"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <ListOrdered size={16} />
                                    <span>Todos los Pedidos</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/admin/historial"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/historial")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <HistoryIcon size={20} />
                        <span>Bitácora</span>
                    </Link>

                    <Link
                        to="/admin/soporte"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/admin/soporte")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <MessageSquare size={20} />
                        <div className="flex items-center justify-between flex-1">
                            <span>CHAT online</span>
                            {unreadCount > 0 ? (
                                <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-bounce shadow-sm font-bold">
                                    <Mail size={10} />
                                    {unreadCount}
                                </span>
                            ) : (
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                        </div>
                    </Link>
                </nav>

                {/* Sidebar Footer (Logout) */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                            {email}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {email ? email.charAt(0).toUpperCase() : "A"}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-gray-50 rounded-tl-3xl border-t border-l border-gray-200 shadow-sm mt-0 ml-0 lg:mt-2 lg:ml-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
