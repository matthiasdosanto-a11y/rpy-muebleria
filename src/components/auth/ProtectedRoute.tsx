import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) checkAuth();
      else {
        setLoading(false);
        setIsAuthorized(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [requiredRole]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // Consultar el rol
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role_id, roles(name)")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        console.error("Error al cargar perfil o no existe:", error);
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // 👇 CORRECCIÓN: Usamos 'as any' para evitar errores de tipos con la relación 'roles'
      const roleName = (profile.roles as any)?.name;

      if (roleName === requiredRole) {
        setIsAuthorized(true);
      } else {
        console.warn(`El usuario tiene rol "${roleName}" pero se requiere "${requiredRole}"`);
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verificando permisos...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirigir al home si no tiene permiso
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
