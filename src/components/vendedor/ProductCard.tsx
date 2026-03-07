import { Armchair, Package } from "lucide-react";
import { Link } from "react-router-dom";

export interface ProductData {
    id: string;
    nombre: string;
    precio: string;
    stock: number;
    categoria: string;
}

export const ProductCard = ({ product }: { product: ProductData }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                <Armchair size={64} className="opacity-50" />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{product.categoria}</span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 leading-tight">{product.nombre}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${product.stock > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                        {product.stock > 0 ? "En Stock" : "Agotado"}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">₲ {parseInt(product.precio).toLocaleString('es-PY')}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Package size={16} />
                        <span>{product.stock} disp.</span>
                    </div>
                </div>

                <Link
                    to={`/vendedor/productos/${product.id}`}
                    className="mt-4 block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors border border-gray-200"
                >
                    Ver más detalles
                </Link>
            </div>
        </div>
    );
};
