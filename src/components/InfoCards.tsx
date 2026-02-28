import { Phone, MapPin, Clock } from "lucide-react";

const cards = [
  {
    icon: Phone,
    label: "TELÉFONO / WHATSAPP",
    title: "Consultanos",
    detail: "Consultas y Stock por WhatsApp",
    action: { text: "Abrir chat", href: "https://wa.me/1234567890" },
  },
  {
    icon: MapPin,
    label: "DIRECCIÓN",
    title: "Visitanos",
    detail: "Encontranos en nuestra sucursal",
    action: { text: "Ver en Maps", href: "https://maps.app.goo.gl/LEdJRWKugVqeLz6t8" },
  },
  {
    icon: Clock,
    label: "HORARIOS",
    title: "Lun a Vie: 9:00 a 18:00",
    detail: "Sáb: 09:00 a 18:00",
    action: null,
  },
];

const InfoCards = () => (
  <section className="container mx-auto px-4 -mt-12 relative z-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-start gap-4 rounded-lg bg-card p-5 shadow-md border border-border hover:shadow-lg transition-shadow"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center">
            <card.icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{card.label}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{card.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.detail}</p>
            {card.action && (
              <a
                href={card.action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-accent hover:underline mt-1 inline-block"
              >
                {card.action.text}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default InfoCards;
