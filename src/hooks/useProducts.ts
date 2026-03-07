import { useState, useEffect } from "react";

export interface ProductData {
    id: string;
    nombre: string;
    precio: string;
    stock: number;
    categoria: string;
    estado: string;
    imageUrl?: string;
}

const DEFAULT_PRODUCTS: ProductData[] = [
    { id: "1", nombre: "Silla Ergonómica Pro", precio: "250000", stock: 12, categoria: "Sillas", estado: "Publicado" },
    { id: "2", nombre: "Mesa de Comedor Roble", precio: "800000", stock: 5, categoria: "Mesas", estado: "Publicado" },
    { id: "3", nombre: "Sofá 3 Cuerpos Minimalista", precio: "1200000", stock: 0, categoria: "Sofás", estado: "Sin Stock" },
    { id: "4", nombre: "Silla de Oficina Básica", precio: "150000", stock: 24, categoria: "Sillas", estado: "Publicado" },
    { id: "5", nombre: "Mesa de Centro Cristal", precio: "350000", stock: 8, categoria: "Mesas", estado: "Publicado" },
];

export const useProducts = () => {
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("rpy_products");
        if (stored) {
            setProducts(JSON.parse(stored));
        } else {
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem("rpy_products", JSON.stringify(DEFAULT_PRODUCTS));
        }
    }, []);

    const saveProducts = (newProducts: ProductData[]) => {
        setProducts(newProducts);
        localStorage.setItem("rpy_products", JSON.stringify(newProducts));
        // Disparar evento para sincronizar otras pestañas/componentes en la misma sesión
        window.dispatchEvent(new Event("products_updated"));
    };

    useEffect(() => {
        const handleSync = () => {
            const stored = localStorage.getItem("rpy_products");
            if (stored) setProducts(JSON.parse(stored));
        };
        window.addEventListener("products_updated", handleSync);
        return () => window.removeEventListener("products_updated", handleSync);
    }, []);

    const addProduct = (p: ProductData) => {
        const newProducts = [...products, p];
        saveProducts(newProducts);
    };

    const updateProduct = (id: string, updatedFields: Partial<ProductData>) => {
        const newProducts = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
        saveProducts(newProducts);
    };

    const deleteProduct = (id: string) => {
        const newProducts = products.filter(p => p.id !== id);
        saveProducts(newProducts);
    };

    return {
        products,
        addProduct,
        updateProduct,
        deleteProduct
    };
};
