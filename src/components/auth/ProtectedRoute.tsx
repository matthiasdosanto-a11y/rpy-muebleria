import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🛡️ [ProtectedRoute] Iniciando verificación...");

        // 1. Verificar sesión
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.warn("🛡️ [ProtectedRoute] ❌ No hay sesión activa");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        console.log("🛡️ [ProtectedRoute] ✅ Sesión activa:", session.user.email);

        // 2. Obtener perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("🛡️ [ProtectedRoute] ❌ Error perfil:", profileError);
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        if (!profile) {
          console.warn("🛡️ [ProtectedRoute] ⚠️ No hay perfil en tabla profiles");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        console.log("🛡️ [ProtectedRoute] ✅ Perfil OK. role_id:", profile.role_id);

        // 3. Si no requiere rol, pasar
        if (!requiredRole) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // 4. Verificar rol
        if (profile.role_id) {
          const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('name')
            .eq('id', profile.role_id)
            .maybeSingle();

          if (roleError) {
            console.error("🛡️ [ProtectedRoute] ❌ Error rol:", roleError);
            setIsAuthorized(false);
            setIsLoading(false);
            return;
          }

          const roleName = role?.name;
          console.log(`🛡️ [ProtectedRoute] 🔍 Rol Usuario: "${roleName}" | Requerido: "${requiredRole}"`);

          if (roleName === requiredRole) {
            console.log("🛡️ [ProtectedRoute] 🎉 AUTORIZADO");
            setIsAuthorized(true);
          } else {
            console.warn(`🛡️ [ProtectedRoute] 🚫 DENEGADO: "${roleName}" !== "${requiredRole}"`);
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }

      } catch (error) {
        console.error("🛡️ [ProtectedRoute] 💥 Error crítico:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    }; // <--- OJO: Cierra checkAuth

    checkAuth();
  }, [requiredRole]); // <--- OJO: Cierra useEffect

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg font-medium text-foreground animate-pulse">Verificando permisos...</div>
      </div>
    );
  }

  // No autorizado
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // Autorizado
  return <>{children}</>;
}; // <--- OJO: Cierra el componente
