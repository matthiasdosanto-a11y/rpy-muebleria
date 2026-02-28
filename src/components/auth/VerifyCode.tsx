import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";

interface VerifyCodeProps {
  email: string;
  telefono: string;
  onBack: () => void;
  onSuccess: () => void;
  siteUrl: string; // 
}

const VerifyCode = ({ email, telefono, onBack, onSuccess }: VerifyCodeProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Timer de expiración
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Función para formatear el teléfono según el país
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Número no disponible";
    
    // Eliminar todos los caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Si es Paraguay (+595...)
    if (phone.startsWith('+595') || cleaned.startsWith('595')) {
      // Asegurar formato +595
      const withCode = cleaned.startsWith('595') ? cleaned : `595${cleaned}`;
      
      if (withCode.length === 12) { // 595 + 9 dígitos
        const match = withCode.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
        if (match) {
          return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
      } else if (withCode.length > 8) {
        // Formato genérico para otros largos
        return `+${withCode.slice(0, 3)} ${withCode.slice(3, 6)} ${withCode.slice(6)}`;
      }
    }
    
    // Si es Brasil (+55...)
    if (phone.startsWith('+55') || cleaned.startsWith('55')) {
      const withCode = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
      if (withCode.length === 12) { // 55 + 2 (DDD) + 9 dígitos
        const match = withCode.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
        if (match) {
          return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
        }
      }
    }
    
    // Formato genérico para otros países
    return phone;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo un dígito
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-enfocar siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si todos los dígitos están llenos, verificar automáticamente
    if (newCode.every(digit => digit) && !newCode.includes("")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    setError("");
    setIsLoading(true);

    // Simular verificación (luego conectaremos con Supabase)
    setTimeout(() => {
      if (fullCode === "123456") { // Código de ejemplo
        onSuccess();
      } else {
        setError("❌ Código incorrecto");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    setTimeLeft(600);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // Aquí iría la lógica para reenviar el código
    console.log("Reenviando código a:", email, telefono);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Verifica tu identidad</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hemos enviado un código de 6 dígitos a:
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-center text-sm">
            <Mail size={16} className="mr-2 text-muted-foreground" />
            <span className="font-medium">{email}</span>
          </div>
          <div className="flex items-center justify-center text-sm">
            <Phone size={16} className="mr-2 text-muted-foreground" />
            <span className="font-medium">WhatsApp {formatPhoneNumber(telefono)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Tiempo restante: <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
          {timeLeft === 0 ? (
            <button
              onClick={handleResendCode}
              className="text-sm text-primary hover:underline mt-2"
            >
              Reenviar código
            </button>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">
              El código expirará en 10 minutos
            </p>
          )}
        </div>

        <button
          onClick={() => handleVerify(code.join(""))}
          disabled={isLoading || code.some(d => !d)}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Verificando..." : "Verificar código"}
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;