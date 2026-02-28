import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import productDining from "@/assets/product-dining.webp";
import productShelf from "@/assets/product-shelf.webp";
import productWardrobe from "@/assets/product-wardrobe.webp";

const products = [
  { id: "mesa-nordica", image: productDining, name: "Mesa Comedor Nórdica", price: 189000, tag: "Nuevo" },
  { id: "biblioteca-modular", image: productShelf, name: "Biblioteca Modular", price: 145000, tag: "Popular" },
  { id: "ropero-2p", image: productWardrobe, name: "Ropero 2 Puertas", price: 220000, tag: "Oferta" },
];

const formatPrice = (n: number) => "Gs" + n.toLocaleString("es-PY");

const FeaturedProducts = () => {
  const { addItem } = useCart();

  return (
    <section id="catalogo" className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Productos Destacados</h2>
        <p className="mt-2 text-muted-foreground">Muebles seleccionados especialmente para vos</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-xl transition-shadow"
          >
            <div className="relative overflow-hidden aspect-square">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground uppercase tracking-wide">
                {p.tag}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <p className="text-lg font-bold text-primary mt-1">{formatPrice(p.price)}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image })}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart size={16} />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
