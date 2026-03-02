import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // 👈 Agregamos Routes y Route aquí
import { CartProvider } from "@/contexts/CartContext";

// 👇 NUEVOS IMPORTS
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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
          <HashRouter> {/* 👈 HashRouter (CORRECTO) */}
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />

              {/* 👇 NUEVA RUTA PROTEGIDA DE ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter> {/* 👈 Cierre correcto (era BrowserRouter antes) */}
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
