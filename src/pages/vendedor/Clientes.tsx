import { useState, useEffect } from "react";
import { Search, Plus, UserPlus, Lock, Edit } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useLogs } from "../../hooks/useLogs";

interface Cliente {
    id: string;
    nombre_completo: string;
    email: string;
    whatsapp: string;
    direccion: string;
    codigo_postal: string;
    referencia: string;
    created_at?: string;
}

const AUTHORIZATION_PASSWORD = "Admin#guardarcliente!";

export const Clientes = () => {
    const { addLog } = useLogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // States for Password Modal
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    // States for Client Modal
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nombre_completo: "",
        email: "",
        whatsapp: "",
        direccion: "",
        codigo_postal: "",
        referencia: ""
    });

    const [userEmail, setUserEmail] = useState("Vendedor");

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) setUserEmail(session.user.email);
        };
        getUser();
    }, []);

    const fetchClientes = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('clientes')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setClientes(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === AUTHORIZATION_PASSWORD) {
            setPasswordInput("");
            setIsPasswordModalOpen(false);
            setIsClientModalOpen(true);
            toast.success("Acceso autorizado");
        } else {
            toast.error("Contraseña de administrador incorrecta");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { data, error } = await supabase
                    .from('clientes')
                    .update(formData)
                    .eq('id', editingId)
                    .select();

                if (error) {
                    toast.error("Error al actualizar cliente: " + error.message);
                } else {
                    toast.success("Cliente actualizado exitosamente");
                    addLog(userEmail, "Modificación de Cliente (Autorizada)", `Se editó el cliente ${formData.nombre_completo} (${formData.email})`);
                    setClientes(prev => prev.map(c => c.id === editingId ? data[0] : c));
                    setIsClientModalOpen(false);
                    setEditingId(null);
                }
            } else {
                const { data, error } = await supabase
                    .from('clientes')
                    .insert([formData])
                    .select();

                if (error) {
                    toast.error("Error al crear cliente: " + error.message);
                } else {
                    toast.success("Cliente creado exitosamente");
                    addLog(userEmail, "Creación de Cliente (Autorizada)", `Se registró al cliente ${formData.nombre_completo} (${formData.email})`);
                    setClientes(prev => [data[0], ...prev]);
                    setIsClientModalOpen(false);
                }
            }

            if (!editingId) {
                setFormData({
                    nombre_completo: "",
                    email: "",
                    whatsapp: "",
                    direccion: "",
                    codigo_postal: "",
                    referencia: ""
                });
            }
        } catch (error: any) {
            toast.error("Error al conectar con la base de datos", error.message);
        }
    };

    const filteredClientes = clientes.filter(c =>
        c.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Directorio de Clientes</h2>
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <UserPlus size={20} />
                    <span>Registrar Cliente</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
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
                                <th className="px-6 py-4">Nombre Completo</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">WhatsApp</th>
                                <th className="px-6 py-4">Dirección</th>
                                <th className="px-6 py-4">Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Cargando clientes...
                                    </td>
                                </tr>
                            ) : filteredClientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No hay clientes registrados o no coinciden con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredClientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{cliente.nombre_completo}</td>
                                        <td className="px-6 py-4 text-gray-500">{cliente.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{cliente.whatsapp}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={cliente.direccion}>{cliente.direccion}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {cliente.created_at ? new Date(cliente.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setFormData({
                                                        nombre_completo: cliente.nombre_completo,
                                                        email: cliente.email,
                                                        whatsapp: cliente.whatsapp,
                                                        direccion: cliente.direccion,
                                                        codigo_postal: cliente.codigo_postal,
                                                        referencia: cliente.referencia
                                                    });
                                                    setEditingId(cliente.id);
                                                    setIsPasswordModalOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Contraseña de Autorización */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                            <Lock className="text-primary" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Autorización Requerida</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Esta acción requiere autorización de un administrador. Introduce la clave de seguridad para continuar.
                            </p>
                            <form id="authForm" onSubmit={handlePasswordSubmit}>
                                <input
                                    autoFocus
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Contraseña de autorización"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center tracking-widest"
                                />
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsPasswordModalOpen(false); setPasswordInput(""); }}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="authForm"
                                className="px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 rounded-lg transition-colors"
                            >
                                Verificar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Registro de Cliente (Oculto protegido) */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Registrar Nuevo Cliente</h3>
                            <button onClick={() => setIsClientModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="clientForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                    <input
                                        required
                                        type="text"
                                        name="nombre_completo"
                                        value={formData.nombre_completo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                                        <input
                                            required
                                            type="text"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            placeholder="Ej: 0981 123 456"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                                        <input
                                            required
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                                        <input
                                            type="text"
                                            name="codigo_postal"
                                            value={formData.codigo_postal}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Referencia de Domicilio</label>
                                    <textarea
                                        name="referencia"
                                        rows={3}
                                        value={formData.referencia}
                                        onChange={handleChange}
                                        placeholder="Color de casa, comercios cercanos..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsClientModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="clientForm"
                                className="px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 rounded-lg transition-colors"
                            >
                                Guardar Cliente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
