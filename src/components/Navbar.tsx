import { useState, useRef, useEffect } from "react";
import { Search, User, Menu, X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import AuthModal from "./auth/AuthModal";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nuestros Muebles", href: "#muebles" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Ofertas", href: "#ofertas" },
  { label: "Contacto", href: "#contacto" },
];

const formatPrice = (n: number) =>
  "$" + n.toLocaleString("es-AR");

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // 👈 Estado para el modal
  const cartRef = useRef<HTMLDivElement>(null);
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  // Close cart dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <a href="#inicio" className="flex flex-col leading-tight">
          <span className="font-display text-xl font-bold text-primary tracking-wide">RPY</span>
          <span className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground">Mueblería Solidaria</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-slide-in">
                <input
                  autoFocus
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="w-48 rounded-full bg-secondary px-4 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-secondary text-foreground/70 hover:text-primary transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* User - MODIFICADO: Ahora abre el modal */}
          <button
            onClick={() => setIsAuthModalOpen(true)} // 👈 Abre el modal
            className="p-2 rounded-full hover:bg-secondary text-foreground/70 hover:text-primary transition-colors"
            aria-label="Mi cuenta"
          >
            <User size={20} />
          </button>

          {/* Cart */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 rounded-full hover:bg-secondary text-foreground/70 hover:text-primary transition-colors"
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart dropdown */}
            {cartOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-xl bg-card border border-border shadow-2xl animate-fade-in-up z-50">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-display font-bold text-foreground text-lg">Tu Carrito</h3>
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Vaciar
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                            <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total ({totalItems} {totalItems === 1 ? "artículo" : "artículos"})</span>
                        <span className="text-xl font-display font-bold text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                      <a
                        href={`https://wa.me/1234567890?text=${encodeURIComponent(
                          "Hola! Me gustaría comprar:\n" +
                            items.map((i) => `• ${i.name} x${i.quantity} - ${formatPrice(i.price * i.quantity)}`).join("\n") +
                            `\n\nTotal: ${formatPrice(totalPrice)}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center rounded-full bg-whatsapp py-2.5 text-sm font-bold text-whatsapp-foreground hover:opacity-90 transition-opacity"
                      >
                        Finalizar por WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp button desktop */}
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-secondary text-foreground/70"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2 animate-fade-in-up">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full rounded-full bg-secondary px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </nav>
      )}

      {/* 👇 Modal de autenticación agregado al final */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;