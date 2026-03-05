import { MapPin, Clock, Truck, CreditCard, TrendingUp } from "lucide-react";
import { WHATSAPP_LINKS } from "@/constants/site";
import { useRef, useState, useEffect } from "react";

const InfoCards = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const cards = [
    {
      id: 1,
      icon: <MapPin className="text-accent w-8 h-8" />,
      title: "DIRECCIÓN",
      subtitle: "Visitanos",
      description: "Encontranos en nuestra sucursal",
      buttonText: "Ver en Maps",
      buttonLink: "https://maps.app.goo.gl/3pgyVMa58YMMbCoaA",
      isExternal: true
    },
    {
      id: 2,
      icon: <Clock className="text-accent w-8 h-8" />,
      title: "HORARIOS",
      subtitle: "Lun a Vie: 9:00 a 18:00",
      description: "Sáb: 09:00 a 18:00",
      buttonText: "ATENCIÓN AL CLIENTE",
      buttonLink: WHATSAPP_LINKS.consulta,
      isExternal: true
    },
    {
      id: 3,
      icon: <Truck className="text-accent w-8 h-8" />,
      title: "ENVIOS",
      subtitle: "",
      description: "Consultá costos y Tiempos de entrega",
      buttonText: "Ingresar ubicación",
      onClick: () => console.log('Abrir simulador de envío')
    },
    {
      id: 4,
      icon: <CreditCard className="text-accent w-8 h-8" />,
      title: "MEDIOS DE PAGO",
      subtitle: "",
      description: "Pagá tus compras de forma rápida y segura",
      buttonText: "Conocer medios",
      onClick: () => console.log('Abrir medios de pago')
    },
    {
      id: 5,
      icon: <TrendingUp className="text-accent w-8 h-8" />,
      title: "MÁS VENDIDOS",
      subtitle: "",
      description: "Explorá los productos que son tendencia",
      buttonText: "Ir a Más vendidos",
      onClick: () => console.log('Abrir más vendidos')
    }
  ];

  return (
    <section className="py-8 -mt-24 sm:-mt-32 md:-mt-40 lg:-mt-48 relative z-10">
      <div className="container mx-auto px-4">
        {/* Flechas de navegación */}
        <div className="hidden md:block relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Contenedor con scroll horizontal */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] snap-start"
            >
              <div className="bg-card rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {card.icon}
                </div>
                <h3 className="font-display text-xs sm:text-sm font-bold text-primary mb-2 tracking-wide uppercase">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="font-body text-xs text-muted-foreground mb-1">{card.subtitle}</p>
                )}
                <p className="font-body text-xs text-muted-foreground mb-4 sm:mb-6 flex-grow">
                  {card.description}
                </p>

                {card.isExternal ? (
                  <a
                    href={card.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block w-full bg-primary text-primary-foreground px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-[11px] sm:text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
                  >
                    {card.buttonText}
                  </a>
                ) : (
                  <button
                    onClick={card.onClick}
                    className="mt-auto block w-full bg-primary text-primary-foreground px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-[11px] sm:text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
                  >
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.clientWidth / 2;
                  scrollContainerRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${Math.floor((scrollContainerRef.current?.scrollLeft || 0) / (scrollContainerRef.current?.clientWidth || 1) * 2) === index
                  ? 'bg-primary w-4'
                  : 'bg-primary/30'
                }`}
              aria-label={`Ir a tarjeta ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default InfoCards;