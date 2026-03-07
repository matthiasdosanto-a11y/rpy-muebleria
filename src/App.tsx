import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

// Admin Imports
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard as AdminDashboard } from "@/pages/admin/Dashboard";
import { Usuarios } from "@/pages/admin/Usuarios";
import { Clientes as AdminClientes } from "@/pages/admin/Clientes";
import { Productos as AdminProductos } from "@/pages/admin/Productos";
import { Historial } from "@/pages/admin/Historial";
import { Pedidos as AdminPedidos } from "@/pages/admin/Pedidos";
import { Soporte as AdminSoporte } from "@/pages/admin/Soporte";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Vendedor Imports
import { VendedorLayout } from "./components/vendedor/VendedorLayout";
import { Dashboard as VendedorDashboard } from "./pages/vendedor/Dashboard";
import { Clientes } from "./pages/vendedor/Clientes";
import { ClienteDetalle } from "./pages/vendedor/ClienteDetalle";
import { Pedidos } from "./pages/vendedor/Pedidos";
import { NuevoPedido } from "./pages/vendedor/NuevoPedido";
import { PedidoDetalle } from "./pages/vendedor/PedidoDetalle";
import { Productos } from "./pages/vendedor/Productos";
import { ProductoDetalle } from "./pages/vendedor/ProductoDetalle";
import { Soporte } from "./pages/vendedor/Soporte";

import { supabase } from './lib/supabaseClient';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true })

        if (error) {
          console.error('❌ Error de conexión con Supabase:', error)
        } else {
          console.log('✅ Conexión exitosa con Supabase')
        }
      } catch (e) {
        console.error('❌ Error:', e)
      }
    }

    testConnection()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />

              {/* RUTA ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoleIds={[1]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="historial" element={<Historial />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="pedidos/nuevo" element={<NotFound />} /> {/* Placeholder hasta que se cree NuevoPedido admin */}
                <Route path="soporte" element={<AdminSoporte />} />
              </Route>

              {/* RUTA VENDEDOR */}
              <Route
                path="/vendedor"
                element={
                  <ProtectedRoute allowedRoleIds={[2]}>
                    <VendedorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<VendedorDashboard />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="clientes/:id" element={<ClienteDetalle />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="pedidos/nuevo" element={<NuevoPedido />} />
                <Route path="pedidos/:id" element={<PedidoDetalle />} />
                <Route path="productos" element={<Productos />} />
                <Route path="productos/:id" element={<ProductoDetalle />} />
                <Route path="soporte" element={<Soporte />} />
              </Route>
            </Routes>
          </HashRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;