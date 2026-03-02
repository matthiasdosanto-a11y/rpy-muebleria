import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  LogOut 
} from "lucide-react";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

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

  const menuItems = [
    { title: "Resumen", icon: LayoutDashboard, color: "bg-blue-500" },
    { title: "Usuarios", icon: Users, color: "bg-green-500" },
    { title: "Inventario", icon: Package, color: "bg-orange-500" },
    { title: "Pedidos", icon: ShoppingCart, color: "bg-purple-500" },
    { title: "Soporte / Chat", icon: MessageSquare, color: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin - RPY Mueblería</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100 group"
              onClick={() => alert(`Aquí irá la sección de ${item.title}`)}
            >
              <div className="flex items-center gap-4">
                <div className={`${item.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Gestionar {item.title.toLowerCase()} del sistema
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
