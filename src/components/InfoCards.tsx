import { MapPin, Clock, Truck, CreditCard, TrendingUp } from "lucide-react";
import { WHATSAPP_LINKS } from "@/constants/site";

const InfoCards = () => {
  return (
    <section className="py-8 -mt-48 relative z-10">
      <div className="container mx-auto px-4">

        {/* Grid de 5 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {/* Tarjeta 1: Dirección */}
          <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <MapPin className="text-accent w-8 h-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary mb-2 tracking-wide uppercase">DIRECCIÓN</h3>
            <p className="font-body text-xs text-muted-foreground mb-1">Visitanos</p>
            <p className="font-body text-xs text-muted-foreground mb-6 flex-grow">Encontranos en nuestra sucursal</p>
            <a
              href="https://maps.app.goo.gl/3pgyVMa58YMMbCoaA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              Ver en Maps
            </a>
          </div>

          {/* Tarjeta 2: Horarios */}
          <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <Clock className="text-accent w-8 h-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary mb-2 tracking-wide uppercase">HORARIOS</h3>
            <p className="font-body text-xs text-muted-foreground mb-1">Lun a Vie: 9:00 a 18:00</p>
            <p className="font-body text-xs text-muted-foreground mb-6 flex-grow">Sáb: 09:00 a 18:00</p>
            <a
              href={WHATSAPP_LINKS.consulta}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              ATENCIÓN AL CLIENTE
            </a>
          </div>

          {/* Tarjeta 3: Ingresá tu ubicación */}
          <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <Truck className="text-accent w-8 h-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary mb-2 tracking-wide uppercase">ENVIOS</h3>
            <p className="font-body text-xs text-muted-foreground mb-6 flex-grow">Consultá costos y Tiempos de entrega</p>
            <button
              onClick={() => console.log('Abrir simulador de envío')}
              className="mt-auto block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              Ingresar ubicación
            </button>
          </div>

          {/* Tarjeta 4: Medios de pago */}
          <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <CreditCard className="text-accent w-8 h-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary mb-2 tracking-wide uppercase">MEDIOS DE PAGO</h3>
            <p className="font-body text-xs text-muted-foreground mb-6 flex-grow">Pagá tus compras de forma rápida y segura</p>
            <button
              onClick={() => console.log('Abrir medios de pago')}
              className="mt-auto block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              Conocer medios
            </button>
          </div>

          {/* Tarjeta 5: Más vendidos */}
          <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 border border-border flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <TrendingUp className="text-accent w-8 h-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary mb-2 tracking-wide uppercase">MÁS VENDIDOS</h3>
            <p className="font-body text-xs text-muted-foreground mb-6 flex-grow">Explorá los productos que son tendencia</p>
            <button
              onClick={() => console.log('Abrir más vendidos')}
              className="mt-auto block w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              Ir a Más vendidos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCards;