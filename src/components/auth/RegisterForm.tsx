import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { supabase } from "../../lib/supabaseClient";

interface RegisterFormProps {
  onLoginClick: () => void;
  onSuccess: (email: string, telefono: string) => void;
  setEmail: (email: string) => void;
  siteUrl: string;
}

const RegisterForm = ({ onLoginClick, onSuccess, setEmail, siteUrl }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Requerido";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    const phoneDigits = formData.telefono.replace(/\D/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      newErrors.telefono = "Número inválido (debe tener entre 8 y 15 dígitos)";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Mínimo 8 caracteres, 1 mayúscula y 1 número";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "No coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMsg(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`, // 👈 ajusta ruta si quieres
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
          },
        },
      });

      if (error) {
        setGeneralError(error.message);
      } else {
        setSuccessMsg("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
        setEmail(formData.email);
        onSuccess(formData.email, formData.telefono);
      }
    } catch (err: any) {
      setGeneralError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Crear cuenta</h2>
      </div>

      {generalError && (
        <p className="text-sm text-red-500 text-center">{generalError}</p>
      )}

      {successMsg && (
        <p className="text-sm text-green-500 text-center">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* nombre/apellido, email, teléfono, password, confirmPassword: igual que ahora */}
        {/* ... deja todo tu JSX de inputs igual, solo cambió handleSubmit ... */}
      </form>
    </div>
  );
};

export default RegisterForm;
