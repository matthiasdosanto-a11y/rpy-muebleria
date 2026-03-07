import { useState } from "react";
import { Search, Plus, Filter, Edit, Trash2, X } from "lucide-react";
import { useProducts, ProductData } from "../../hooks/useProducts";
import { toast } from "sonner";

export const Productos = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        stock: 0,
        categoria: "Sillas",
        estado: "Publicado"
    });

    const handleOpenModal = (product?: ProductData) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                nombre: product.nombre,
                precio: product.precio,
                stock: product.stock,
                categoria: product.categoria,
                estado: product.estado
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nombre: "",
                precio: "",
                stock: 0,
                categoria: "Sillas",
                estado: "Publicado"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que el precio sea numérico
        if (isNaN(Number(formData.precio))) {
            toast.error("El precio debe ser un número válido");
            return;
        }

        const productData = {
            ...formData,
            // Aseguramos que el estado se actualice si el stock es 0
            estado: Number(formData.stock) === 0 ? "Sin Stock" : formData.estado
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
            toast.success("Producto actualizado correctamente");
        } else {
            addProduct({
                id: Date.now().toString(),
                ...productData,
                precio: formData.precio.toString()
            });
            toast.success("Nuevo producto agregado");
        }
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus size={20} />
                    <span>Agregar Producto</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio (Gs)</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{prod.nombre}</td>
                                        <td className="px-6 py-4 text-gray-500">{prod.categoria}</td>
                                        <td className="px-6 py-4 text-gray-900">₲ {parseInt(prod.precio).toLocaleString('es-PY')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${prod.stock === 0 ? 'text-red-500' : 'text-gray-900'}`}>{prod.stock}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${prod.estado === 'Publicado' || prod.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {prod.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(prod)} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`¿Estás seguro de eliminar "${prod.nombre}"?`)) deleteProduct(prod.id);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Producto */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    >
                                        <option value="Sillas">Sillas</option>
                                        <option value="Mesas">Mesas</option>
                                        <option value="Sofás">Sofás</option>
                                        <option value="Escritorios">Escritorios</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Gs)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        placeholder="Ej: 250000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                    >
                                        <option value="Publicado">Publicado</option>
                                        <option value="Borrador">Borrador</option>
                                        <option value="Sin Stock">Sin Stock</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 rounded-lg transition-colors"
                                >
                                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
