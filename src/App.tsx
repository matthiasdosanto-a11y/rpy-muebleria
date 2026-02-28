import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { supabase } from './lib/supabaseClient'; // 👈 Importamos Supabase

const queryClient = new QueryClient();

const App = () => {
  // 👇 Prueba de conexión con Supabase
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

  // 👇 Este es el return que ya tenías
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;