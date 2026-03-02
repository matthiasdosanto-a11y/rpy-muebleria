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
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
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
    } catch (err) {
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
        <p className="text-xs text-red-500 text-center">{generalError}</p>
      )}

      {successMsg && (
        <p className="text-xs text-green-500 text-center">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Nombre"
              />
            </div>
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Apellido"
            />
            {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido}</p>}
          </div>
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Correo electrónico"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <PhoneInput
            defaultCountry="py"
            value={formData.telefono}
            onChange={(phone) => {
              setFormData((prev) => ({ ...prev, telefono: phone }));
              if (errors.telefono) {
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.telefono;
                  return updated;
                });
              }
            }}
            inputClassName="w-full pl-14 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Confirmar contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes cuenta?</span>
          <button
            type="button"
            onClick={onLoginClick}
            className="ml-1 text-primary font-semibold hover:underline"
          >
            Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
