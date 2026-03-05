const Footer = () => (
  <footer id="contacto" className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {/* Logo con efecto de intercambio - IGUAL QUE EN EL NAVBAR */}
          <a
            href="/"
            className="
              group
              relative
              flex items-center justify-center
              w-[200px] h-12
              cursor-pointer
              overflow-hidden
              mb-4
            "
          >
            {/* RPY (visible por defecto, desaparece al hacer hover) */}
            <div className="
              absolute inset-0
              flex items-center justify-center
              transition-all duration-300 ease-in-out
              group-hover:opacity-0 group-hover:scale-95
            ">
              <div className="flex items-end">
                <span className="font-['Arial'] font-black text-primary-foreground text-4xl leading-none">
                  R
                </span>
                <span className="font-['Poppins'] font-black text-primary-foreground text-2xl leading-none ml-1">
                  PY
                </span>
              </div>
            </div>

            {/* MUEBLERIA SOLIDARIA (oculto por defecto, aparece al hacer hover) */}
            <div className="
              absolute inset-0
              flex items-center justify-center
              transition-all duration-300 ease-in-out
              opacity-0 scale-95
              group-hover:opacity-100 group-hover:scale-100
            ">
              <span className="
                font-['Poppins'] font-bold
                text-primary-foreground text-sm
                tracking-[0.15em]
                whitespace-nowrap
                px-2
              ">
                MUEBLERÍA SOLIDARIA
              </span>
            </div>
          </a>

          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Muebles de calidad para cada rincón de tu hogar.
            Encontrá lo que necesitás al mejor precio.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#inicio" className="hover:text-primary-foreground transition-colors">Inicio</a></li>
            <li><a href="#muebles" className="hover:text-primary-foreground transition-colors">Nuestros Muebles</a></li>
            <li><a href="#catalogo" className="hover:text-primary-foreground transition-colors">Catálogo</a></li>
            <li><a href="#ofertas" className="hover:text-primary-foreground transition-colors">Ofertas</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>📱 WhatsApp: +595 XXX XXX XXXX</li>
            <li>
              📍{" "}
              <a
                href="https://maps.app.goo.gl/3pgyVMa58YMMbCoaA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors inline-block"
              >
                Teniente Ettiene y Las Residentas Fdo de la Mora Z/N
              </a>
            </li>
            <li>🕐 Lun a Vie: 9:00 a 17:00</li>
            <li>🕐 Sab: 9:00 a 18:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs text-primary-foreground/60">
        © 2026 RpyCode. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;