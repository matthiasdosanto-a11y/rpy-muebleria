import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
  onCodeSent: (email: string) => void;
   siteUrl: string; //
}

const ForgotPassword = ({ onBack, onCodeSent }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const registeredUsers = [
    { email: "test@test.com" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de correo inválido");
      setIsLoading(false);
      return;
    }

    // Verificar si existe
    setTimeout(() => {
      const userExists = registeredUsers.some(u => u.email === email);
      
      if (userExists) {
        setSuccess(true);
        onCodeSent(email);
      } else {
        setError("❌ Este correo no está registrado");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver al inicio de sesión
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Recuperar contraseña</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Te enviaremos un código de verificación a tu correo
        </p>
      </div>

      {success ? (
        <div className="text-center text-green-600 bg-green-50 p-4 rounded-lg">
          ¡Código enviado! Revisa tu correo electrónico.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar código"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;