import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotClick: () => void;
  onSuccess: () => void;
  onVerify: (email: string) => void;
  siteUrl: string;
}

const LoginForm = ({
  onRegisterClick,
  onForgotClick,
  onSuccess,
  onVerify,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- ETAPA 1: VALIDAR EMAIL (usando la función RPC) ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Validar formato y limpiar espacios
    const emailLimpio = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailLimpio)) {
      setError("Por favor, ingresa un correo válido.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Llamar a la función RPC para verificar si el email existe
      const { data: existe, error: rpcError } = await supabase
        .rpc('check_email_exists', { email_to_check: emailLimpio });

      if (rpcError) {
        console.error("Error al verificar email:", rpcError);
        setError("Error de conexión. Intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      // 3. Si el email NO existe, mostrar mensaje
      if (!existe) {
        setError("Este correo no está registrado en nuestro sistema.");
        setIsLoading(false);
        return;
      }

      // 4. Si el email SÍ existe, guardar y pasar al paso de contraseña
      setEmail(emailLimpio);
      setStep("password");
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Ocurrió un error al verificar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- ETAPA 2: LOGIN REAL ---
  // --- ETAPA 2: LOGIN REAL CON LOGS ---
const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  console.log("🔑 Intentando login con:", email); // 👈 1. Qué email usamos

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("📦 Respuesta de Supabase:", { data, error: authError }); // 👈 2. Qué responde Supabase

  if (authError) {
    console.error("❌ Error de Auth:", authError.message); // 👈 3. Si hay error, cuál es
    
    if (authError.message.includes("Email not confirmed")) {
      setError("Tu correo aún no está verificado. Revisa tu bandeja de entrada.");
      onVerify(email);
    } else if (authError.message.includes("Invalid login credentials")) {
      setError("Contraseña incorrecta.");
    } else {
      setError(authError.message);
    }
    setIsLoading(false);
    return;
  }

  if (data?.session) {
    console.log("✅ LOGIN EXITOSO. Sesión:", data.session); // 👈 4. Login OK y sesión
    console.log("🚀 Llamando a onSuccess()..."); // 👈 5. Verificamos que se llama a onSuccess
    onSuccess();
  } else {
    console.warn("⚠️ Login OK pero sesión es nula"); // 👈 6. Caso raro: login ok sin sesión
    setError("No se pudo iniciar sesión. Intenta de nuevo.");
  }
  setIsLoading(false);
};

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Bienvenido</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Inicia sesión en tu cuenta
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p>{error}</p>
                {error.includes("no está registrado") && (
                  <button
                    type="button"
                    onClick={onRegisterClick}
                    className="mt-1 text-primary font-semibold hover:underline"
                  >
                    ¿Crear una cuenta?
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verificando..." : "Continuar"}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Ingresa tu contraseña"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotClick}
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError("");
              setPassword("");
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            ← Usar otro correo
          </button>
        </form>
      )}

      <div className="text-center text-sm">
        <span className="text-muted-foreground">¿No tienes cuenta?</span>
        <button
          onClick={onRegisterClick}
          className="ml-2 text-primary font-semibold hover:underline"
        >
          Regístrate
        </button>
      </div>
    </div>
  );
};

export default LoginForm;