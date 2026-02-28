const OffersSection = () => (
  <section id="ofertas" className="bg-secondary py-16">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">🔥 Ofertas Especiales</h2>
      <p className="mt-2 text-muted-foreground mb-8">Aprovechá nuestras promociones exclusivas</p>
      <div className="max-w-2xl mx-auto rounded-2xl bg-card p-8 md:p-12 border border-border shadow-lg">
        <p className="text-5xl md:text-6xl font-display font-bold text-accent">20% OFF</p>
        <p className="mt-4 text-lg text-foreground font-semibold">En toda la línea de Dormitorios</p>
        <p className="mt-2 text-sm text-muted-foreground">Válido hasta agotar stock. Consultá disponibilidad por WhatsApp.</p>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity"
        >
          Consultar Oferta
        </a>
      </div>
    </div>
  </section>
);

export default OffersSection;
