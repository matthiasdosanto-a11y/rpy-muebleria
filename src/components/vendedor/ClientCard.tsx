import { User, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export interface ClientData {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    ultimaCompra: string;
    totalGastado: string;
}

export const ClientCard = ({ client }: { client: ClientData }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{client.nombre}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Mail size={14} /> {client.email}
                    </p>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{client.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Última compra: {client.ultimaCompra}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span>Total gastado: {client.totalGastado}</span>
                </div>
            </div>

            <Link
                to={`/vendedor/clientes/${client.id}`}
                className="mt-2 w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors border border-gray-200"
            >
                Ver historial
            </Link>
        </div>
    );
};
