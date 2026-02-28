const Footer = () => (
  <footer id="contacto" className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl font-bold mb-2">RPY</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-4">Mueblería Solidaria</p>
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
            <li>📍 Teniente Ettiene y Las Residentas Fdo de la Mora Z/N</li>
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
