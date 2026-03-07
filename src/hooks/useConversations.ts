import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Conversation {
    contacto_email: string;
    contacto_nombre: string;
    ultimo_mensaje: string;
    no_leidos: number;
    timestamp_ms: number;
}

export const useConversations = () => {
    const [conversaciones, setConversaciones] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user?.email) {
                setCurrentUserEmail(data.session.user.email);
            } else {
                // Fallback si no hay sesión activa (para desarrollo)
                setCurrentUserEmail("admin@rpymuebleria.com");
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        if (!currentUserEmail) return;

        const fetchConversations = async () => {
            setLoading(true);
            try {
                // 1. Obtener todos los mensajes donde participa el usuario
                const { data: messages, error: msgError } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .or(`sender_email.eq.${currentUserEmail},receiver_email.eq.${currentUserEmail}`)
                    .order('timestamp_ms', { ascending: false });

                if (msgError) throw msgError;

                // 2. Obtener todos los perfiles para los nombres (nombre + apellido)
                const { data: profiles, error: profError } = await supabase
                    .from('profiles')
                    .select('email, nombre, apellido');

                if (profError) throw profError;

                const profileMap = new Map(profiles.map(p => [
                    p.email,
                    `${p.nombre || ''} ${p.apellido || ''}`.trim() || p.email
                ]));

                // 3. Agrupar por contacto
                const convoMap = new Map<string, Conversation>();

                messages?.forEach(m => {
                    const isSender = m.sender_email === currentUserEmail;
                    const contactEmail = isSender ? m.receiver_email : m.sender_email;

                    if (!convoMap.has(contactEmail)) {
                        convoMap.set(contactEmail, {
                            contacto_email: contactEmail,
                            contacto_nombre: profileMap.get(contactEmail) || contactEmail,
                            ultimo_mensaje: m.content,
                            no_leidos: 0,
                            timestamp_ms: m.timestamp_ms
                        });
                    }

                    // Contar no leídos (mensajes recibidos que no han sido leídos)
                    if (!isSender && !m.is_read) {
                        const convo = convoMap.get(contactEmail)!;
                        convo.no_leidos += 1;
                    }
                });

                setConversaciones(Array.from(convoMap.values()));
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        // Suscribirse a cambios para actualizar la lista en tiempo real
        const channel = supabase
            .channel('realtime:conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserEmail]);

    return { conversaciones, loading };
};
