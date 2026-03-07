import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "../../components/vendedor/SearchBar";
import { User, Plus, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";

export const NuevoPedido = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [clienteBusqueda, setClienteBusqueda] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

    const [productoBusqueda, setProductoBusqueda] = useState("");
    const [productosCarrito, setProductosCarrito] = useState<any[]>([]);

    // Mocks
    const clientesMock = [
        { id: "1", nombre: "Juan Pérez", email: "juan@email.com" },
        { id: "2", nombre: "María García", email: "maria@email.com" },
    ];

    const productosMock = [
        { id: "1", nombre: "Silla Ergonómica Pro", precio: 250000, stock: 15 },
        { id: "2", nombre: "Mesa de Comedor Roble", precio: 800000, stock: 5 },
    ];

    const handleNextStep = () => {
        if (step === 1 && !clienteSeleccionado) return;
        if (step === 2 && productosCarrito.length === 0) return;
        setStep(s => s + 1);
    };

    const handlePrevStep = () => {
        setStep(s => s - 1);
    };

    const agregarProducto = (producto: any) => {
        const existe = productosCarrito.find(p => p.id === producto.id);
        if (existe) {
            setProductosCarrito(productosCarrito.map(p =>
                p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
            ));
        } else {
            setProductosCarrito([...productosCarrito, { ...producto, cantidad: 1 }]);
        }
    };

    const eliminarProducto = (id: string) => {
        setProductosCarrito(productosCarrito.filter(p => p.id !== id));
    };

    const totalCarrito = productosCarrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);

    const formatCurrency = (amount: number) => `₲ ${amount.toLocaleString('es-PY')}`;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Pedido</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                {[1, 2, 3].map((num) => (
                    <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white transition-colors duration-300 ${step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        {num}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

                {/* PASO 1: CLIENTE */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Paso 1: Seleccionar Cliente</h3>

                        <SearchBar
                            value={clienteBusqueda}
                            onChange={(e) => setClienteBusqueda(e.target.value)}
                            placeholder="🔍 Buscar cliente por nombre o email..."
                        />

                        <div className="space-y-3 mt-4">
                            {clientesMock.map(cliente => (
                                <div
                                    key={cliente.id}
                                    onClick={() => setClienteSeleccionado(cliente)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${clienteSeleccionado?.id === cliente.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${clienteSeleccionado?.id === cliente.id ? 'border-primary' : 'border-gray-300'
                                        }`}>
                                        {clienteSeleccionado?.id === cliente.id && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                    </div>
                                    <User size={20} className="text-gray-400" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{cliente.nombre}</h4>
                                        <p className="text-sm text-gray-500">{cliente.email}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-primary font-medium justify-center">
                                <Plus size={20} />
                                <span>+ Nuevo Cliente</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleNextStep}
                                disabled={!clienteSeleccionado}
                                className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 2: PRODUCTOS */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Paso 2: Agregar Productos</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Buscador de productos */}
                            <div className="space-y-4">
                                <SearchBar
                                    value={productoBusqueda}
                                    onChange={(e) => setProductoBusqueda(e.target.value)}
                                    placeholder="🔍 Buscar producto..."
                                />

                                <div className="space-y-3">
                                    {productosMock.map(producto => (
                                        <div key={producto.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center group hover:border-primary/30 transition-colors bg-gray-50">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
                                                <p className="text-xs text-gray-500 mt-1">Stock: {producto.stock} | Precio: {formatCurrency(producto.precio)}</p>
                                            </div>
                                            <button
                                                onClick={() => agregarProducto(producto)}
                                                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carrito */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col h-full">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Productos agregados
                                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{productosCarrito.length}</span>
                                </h4>

                                <div className="flex-1 space-y-3 overflow-y-auto min-h-[150px]">
                                    {productosCarrito.length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                                            No hay productos en el pedido
                                        </div>
                                    ) : (
                                        productosCarrito.map(item => (
                                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">{item.nombre} x{item.cantidad}</p>
                                                    <p className="text-xs text-primary font-semibold mt-0.5">{formatCurrency(item.precio * item.cantidad)}</p>
                                                </div>
                                                <button
                                                    onClick={() => eliminarProducto(item.id)}
                                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                                        <span>Subtotal:</span>
                                        <span className="text-primary">{formatCurrency(totalCarrito)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <button
                                onClick={handlePrevStep}
                                className="bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={handleNextStep}
                                disabled={productosCarrito.length === 0}
                                className="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 3: CONFIRMAR */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Confirmar Pedido</h3>
                            <p className="text-gray-500 mt-2">Revisa que todos los datos sean correctos antes de confirmar.</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">Resumen del Pedido</h4>

                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Cliente:</span>
                                    <span className="font-semibold text-gray-900">{clienteSeleccionado?.nombre}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Total Productos:</span>
                                    <span className="font-semibold text-gray-900">{productosCarrito.reduce((a, c) => a + c.cantidad, 0)} items</span>
                                </div>
                                <div className="flex justify-between py-4 mt-2">
                                    <span className="text-lg font-bold text-gray-900">Total a Pagar:</span>
                                    <span className="text-2xl font-black text-primary">{formatCurrency(totalCarrito)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-8 max-w-2xl mx-auto">
                            <button
                                onClick={handlePrevStep}
                                className="bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={() => {
                                    alert("🎉 Pedido Confirmado Correctamente!");
                                    navigate("/vendedor/pedidos");
                                }}
                                className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex items-center gap-2"
                            >
                                <CheckCircle2 size={20} />
                                Confirmar y Guardar
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
