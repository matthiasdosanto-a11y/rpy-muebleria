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
    <section id="inicio" className="relative h-[70vh] min-h-[450px] max-h-[650px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
        <span className="inline-block w-fit rounded bg-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm mb-4">
          {slides[current].tag}
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-4 animate-fade-in-up" key={`title-${current}`}>
          {slides[current].title}
        </h1>
        <p className="max-w-lg text-base md:text-lg text-primary-foreground/85 leading-relaxed animate-fade-in-up" key={`desc-${current}`} style={{ animationDelay: "0.15s" }}>
          {slides[current].description}
        </p>
        <a
          href="#catalogo"
          className="mt-6 inline-block w-fit rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          VER PRODUCTOS
        </a>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/30 backdrop-blur-sm p-2 text-primary-foreground hover:bg-card/50 transition" aria-label="Anterior">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/30 backdrop-blur-sm p-2 text-primary-foreground hover:bg-card/50 transition" aria-label="Siguiente">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-accent w-6" : "bg-primary-foreground/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
