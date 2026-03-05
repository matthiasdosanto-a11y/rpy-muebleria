import { WHATSAPP_LINKS } from "@/constants/site";

const OffersSection = () => (
  <section id="ofertas" className="bg-secondary py-16">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Ofertas Especiales</h2>
      <p className="mt-2 text-muted-foreground mb-8 font-body">Aprovechá nuestras promociones exclusivas</p>
      <div className="max-w-2xl mx-auto rounded-xl bg-card p-8 md:p-12 border-2 border-accent shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-lg">
          Tiempo Limitado
        </div>
        <p className="text-5xl md:text-6xl font-display font-bold text-primary mt-4">20% OFF</p>
        <p className="mt-4 text-lg text-foreground font-semibold">En toda la línea de Dormitorios</p>
        <p className="mt-2 text-sm text-muted-foreground">Válido hasta agotar stock. Consultá disponibilidad por WhatsApp.</p>
        <a
          href={WHATSAPP_LINKS.base}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-widest shadow-md"
        >
          Consultar Oferta
        </a>
      </div>
    </div>
  </section>
);

export default OffersSection;
