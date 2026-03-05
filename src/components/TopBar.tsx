import { useState, useEffect } from 'react';
import { Instagram, Facebook, ChevronRight } from 'lucide-react';
import { SOCIAL_LINKS } from "@/constants/site";

const TopBar = () => {
  const [mensajeActual, setMensajeActual] = useState(0);

  const mensajes = [
    {
      texto: "🎁 ¿Eres nuevo cliente? Regístrate y obtén 10% OFF en tu primera compra online",
      link: "/registro"
    },
    {
      texto: "🚚 ENVÍO GRATIS en compras mayores a Gs. 500.000",
      link: "/envios"
    },
    {
      texto: "🔥 HASTA 70% OFF en nuestra sección de liquidación",
      link: "/ofertas"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMensajeActual((prev) => (prev + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const redesSociales = [
    { icon: <Instagram size={18} />, nombre: 'Instagram', url: SOCIAL_LINKS.instagram },
    { icon: <Facebook size={18} />, nombre: 'Facebook', url: SOCIAL_LINKS.facebook },
  ];

  return (
    <div className="bg-primary text-primary-foreground text-sm py-2 border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Redes Sociales - Solo Instagram y Facebook */}
          <div className="flex items-center space-x-3">
            {redesSociales.map((red, index) => (
              <a
                key={index}
                href={red.url}
                className="text-accent hover:text-accent/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {red.icon}
              </a>
            ))}
          </div>

          {/* Mensaje rotativo - SIN icono adicional */}
          <div className="flex-1 text-center">
            <a
              href={mensajes[mensajeActual].link}
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              {mensajes[mensajeActual].texto}
              <ChevronRight size={14} />
            </a>
          </div>

          {/* Espacio vacío a la derecha (antes estaba el email) */}
          <div className="w-[100px] hidden lg:block">
            {/* Vacío por ahora */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;