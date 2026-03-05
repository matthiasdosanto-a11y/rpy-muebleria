import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/images/1a.png";
import hero2 from "@/assets/images/2a.png";
import hero3 from "@/assets/images/3a.png";

const slides = [
  {
    image: hero1,
    tag: "Categoría",
    title: "LIVING",
    description: "Diseñá tu espacio de reunión con nuestros elegantes muebles. Sofás, sillones, mesas y mucho más.",
  },
  {
    image: hero2,
    tag: "Categoría",
    title: "DORMITORIOS",
    description: "Muebles que transforman tu descanso en estilo. Camas, armarios y mesitas cuidadosamente diseñados.",
  },
  {
    image: hero3,
    tag: "Categoría",
    title: "COCINAS",
    description: "Equipá tu espacio culinario con muebles funcionales y de diseño que se adaptan a tu estilo.",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="inicio" className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Overlay oscuro al 40% (ya definido en index.css var(--hero-overlay), pero aquí lo forzamos negro 40% según spec) */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-start pt-12 md:pt-16 pl-10 md:pl-14 pr-6 md:pr-12">
        <span className="inline-block w-fit rounded bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-sm mb-4">
          {slides[current].tag}
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 animate-fade-in-up" key={`title-${current}`}>
          {slides[current].title}
        </h1>
        <p className="max-w-lg text-base md:text-lg text-white/90 leading-relaxed animate-fade-in-up" key={`desc-${current}`} style={{ animationDelay: "0.15s" }}>
          {slides[current].description}
        </p>
        <a
          href="#catalogo"
          className="mt-6 inline-block w-fit rounded-lg bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors animate-fade-in-up uppercase tracking-wide"
          style={{ animationDelay: "0.3s" }}
        >
          VER PRODUCTOS
        </a>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 backdrop-blur-sm p-3 text-white hover:bg-primary transition-colors" aria-label="Anterior">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 backdrop-blur-sm p-3 text-white hover:bg-primary transition-colors" aria-label="Siguiente">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-accent w-8" : "bg-white/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;