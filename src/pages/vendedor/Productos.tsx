import { useState } from "react";
import { SearchBar } from "../../components/vendedor/SearchBar";
import { Filters } from "../../components/vendedor/Filters";
import { ProductCard } from "../../components/vendedor/ProductCard";
import { useProducts } from "../../hooks/useProducts";

export const Productos = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const categories = [
        { label: "Sillas", value: "silla" },
        { label: "Mesas", value: "mesa" },
        { label: "Sofás", value: "sofa" },
    ];

    const { products } = useProducts();

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? p.categoria.toLowerCase().includes(categoryFilter) : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-96">
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar producto por nombre..."
                    />
                </div>
                <div className="w-full sm:w-auto flex gap-4">
                    <Filters
                        options={categories}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No se encontraron productos que coincidan con la búsqueda.
                    </div>
                )}
            </div>
        </div>
    );
};
