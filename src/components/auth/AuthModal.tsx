import { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "login" | "register" | "forgot" | "verify";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  // URL base (toma de .env o usa la actual)
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderView = () => {
    switch (view) {
      case "login":
        return (
          <LoginForm
            onRegisterClick={() => setView("register")}
            onForgotClick={() => setView("forgot")}
            // ✅ REDIRECCIÓN CORREGIDA Y MEJORADA
            onSuccess={() => {
              console.log("✅ LOGIN CORRECTO. Ejecutando onSuccess...");
              
              // 1. Cerrar modal
              onClose();
              
              // 2. Redirección simple y directa
              setTimeout(() => {
                console.log("🔄 Redirigiendo a /#/admin...");
                window.location.href = '/#/admin';
              }, 100);
            }}
            onVerify={(email) => {
              setEmail(email);
              setView("verify");
            }}
            siteUrl={siteUrl}
          />
        );

      case "register":
        return (
          <RegisterForm
            onLoginClick={() => setView("login")}
            onSuccess={(userEmail: string, userTelefono: string) => {
              setEmail(userEmail);
              setTelefono(userTelefono);
              setView("verify");
            }}
            setEmail={setEmail}
            siteUrl={siteUrl}
          />
        );

      case "forgot":
        return (
          <ForgotPassword
            onBack={() => setView("login")}
            onCodeSent={(email) => {
              setEmail(email);
              setView("verify");
            }}
            siteUrl={siteUrl}
          />
        );

      case "verify":
        return (
          <VerifyCode
            email={email}
            telefono={telefono}
            onBack={() => setView("login")}
            onSuccess={onClose}
            siteUrl={siteUrl}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header fijo */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-5">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;