import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
  siteUrl //
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simulación de usuarios registrados (esto debería venir de tu backend)
  const registeredUsers = [
    { email: "test@test.com", password: "Test123" },
    { email: "usuario@ejemplo.com", password: "Usuario123" },
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de correo inválido");
      setIsLoading(false);
      return;
    }

    // Simular verificación de email (esto debería ser una llamada a tu API)
    setTimeout(() => {
      const userExists = registeredUsers.some(u => u.email === email);
      
      if (userExists) {
        setStep("password");
        setError("");
      } else {
        setError("❌ Correo no registrado. ¿Deseas crear una cuenta?");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular verificación de contraseña
    setTimeout(() => {
      const user = registeredUsers.find(u => u.email === email);
      
      if (user && user.password === password) {
        onSuccess();
      } else {
        setError("❌ Contraseña incorrecta");
      }
      setIsLoading(false);
    }, 1000);
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
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {error}
              {error.includes("crear una cuenta") && (
                <button
                  onClick={onRegisterClick}
                  className="ml-2 text-primary font-semibold hover:underline"
                >
                  Registrarse
                </button>
              )}
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
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Verificando..." : "Iniciar sesión"}
          </button>

          <button
            type="button"
            onClick={() => setStep("email")}
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