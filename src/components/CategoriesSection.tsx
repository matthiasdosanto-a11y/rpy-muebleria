import heroLiving from "@/assets/hero-living.webp";
import heroBedroom from "@/assets/hero-bedroom.webp";
import heroKitchen from "@/assets/hero-kitchen.webp";

const categories = [
  { image: heroLiving, name: "Living", count: "24 productos" },
  { image: heroBedroom, name: "Dormitorios", count: "18 productos" },
  { image: heroKitchen, name: "Cocinas", count: "15 productos" },
];

const CategoriesSection = () => (
  <section id="muebles" className="container mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Nuestros Muebles</h2>
      <p className="mt-2 text-muted-foreground">Explorá nuestras categorías</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <a
          key={cat.name}
          href="#catalogo"
          className="group relative rounded-xl overflow-hidden aspect-[4/3]"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-2xl font-display font-bold text-primary-foreground">{cat.name}</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">{cat.count}</p>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default CategoriesSection;
