import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

// 👇 IMPORTS CORRECTOS
import { AdminDashboard } from "./pages/AdminDashboard"; // Debe existir este archivo
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
          <HashRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />

              {/* 👇 RUTA PROTEGIDA CORREGIDA */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard /> {/* 👈 AHORA COINCIDE CON LA IMPORTACIÓN */}
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;