import { useConversations } from '../../hooks/useConversations';
import { MessageSquare, User, Clock, Bell } from "lucide-react";

export default function Historial() {
    const { conversaciones, loading } = useConversations();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-gray-500 animate-pulse">Cargando tus conversaciones...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mis conversaciones</h2>
                        <p className="text-sm text-gray-500">Historial de chats activos y mensajes recientes.</p>
                    </div>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                    {conversaciones.length} Conversaciones
                </span>
            </div>

            {conversaciones.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No hay chats activos</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Cuando comiences a chatear con otros usuarios, aparecerán aquí.</p>
                </div>
            ) : (
                <ul className="grid gap-4">
                    {conversaciones.map(c => (
                        <li
                            key={c.contacto_email}
                            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-primary/20 group cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <User size={24} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                                            {c.contacto_nombre}
                                        </h3>
                                        {c.no_leidos > 0 && (
                                            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                                                <Bell size={10} />
                                                {c.no_leidos}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1">
                                        {c.contacto_email}
                                    </p>

                                    <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100/50 transition-colors">
                                        <p className="text-sm text-gray-600 italic line-clamp-2">
                                            "{c.ultimo_mensaje}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
