// src/constants/site.ts
// Variables de negocio centralizadas de RPY Mueblería
// Para cambiar el número de WhatsApp, actualizá VITE_WHATSAPP_NUMBER en .env.local

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "1234567890";

export const WHATSAPP_LINKS = {
  /** Link básico: abre WhatsApp sin mensaje */
  base: `https://wa.me/${WHATSAPP_NUMBER}`,

  /** Link con saludo genérico */
  consulta: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, tengo una consulta")}`,
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/rpymuebleria",
  facebook:  "https://www.facebook.com/rpymuebleria",
};

export const CONTACT = {
  email: "contacto@rpymuebleria.com",
};
