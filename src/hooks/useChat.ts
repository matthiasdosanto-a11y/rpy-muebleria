import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Message {
    id: string;
    chatId: string; // Email del otro usuario en la conversación
    sender: string; // Email del remitente
    text: string;
    time: string;
    timestamp: number;
    read?: boolean;
}

export interface ChatThread {
    id: string;
    name: string;
    lastMessage?: string;
    time?: string;
    unreadCount: number;
    online: boolean;
}

export const useChat = (currentUserEmail: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    // Normalizar email a minúsculas desde el inicio para evitar inconsistencias con RLS
    const normalizedEmail = currentUserEmail?.toLowerCase() ?? "";

    // Cargar mensajes iniciales desde Supabase
    useEffect(() => {
        if (!normalizedEmail) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .or(`sender_email.eq.${normalizedEmail},receiver_email.eq.${normalizedEmail}`)
                .order('timestamp_ms', { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                return;
            }

            if (data) {
                const mappedMessages: Message[] = data.map(m => ({
                    id: m.id,
                    chatId: m.sender_email === normalizedEmail ? m.receiver_email : m.sender_email,
                    sender: m.sender_email,
                    text: m.content,
                    time: new Date(m.timestamp_ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: m.timestamp_ms,
                    read: m.is_read
                }));
                setMessages(mappedMessages);
            }
        };

        fetchMessages();

        // Suscribirse a cambios en tiempo real
        const channel = supabase
            .channel(`chat:${normalizedEmail}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `receiver_email=eq.${normalizedEmail}`
            }, (payload) => {
                const newMsg = payload.new;
                const mappedMsg: Message = {
                    id: newMsg.id,
                    chatId: newMsg.sender_email,
                    sender: newMsg.sender_email,
                    text: newMsg.content,
                    time: new Date(newMsg.timestamp_ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: newMsg.timestamp_ms,
                    read: newMsg.is_read
                };

                setMessages(prev => {
                    // Evitar duplicados si el mensaje ya fue insertado optimistamente
                    if (prev.some(m => m.id === mappedMsg.id)) return prev;
                    return [...prev, mappedMsg];
                });
                if (isSoundEnabled) playNotificationSound();
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chat_messages'
            }, (payload) => {
                const updatedMsg = payload.new;
                setMessages(prev => prev.map(m =>
                    m.id === updatedMsg.id ? { ...m, read: updatedMsg.is_read } : m
                ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [normalizedEmail, isSoundEnabled]);

    const playNotificationSound = () => {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked:", e));
    };

    const sendMessage = async (targetChatId: string, text: string): Promise<boolean> => {
        const trimmedText = text.trim();
        if (!trimmedText) return false;

        const timestamp = Date.now();
        const sender_email = normalizedEmail;
        const receiver_email = targetChatId.toLowerCase();

        const newMessageDB = {
            sender_email,
            receiver_email,
            content: trimmedText,
            timestamp_ms: timestamp,
            is_read: false
        };

        const { data, error } = await supabase
            .from('chat_messages')
            .insert([newMessageDB])
            .select();

        if (error) {
            console.error("Error sending message:", error);
            throw new Error(error.message || "Error al insertar en la base de datos");
        }

        if (data && data[0]) {
            const m = data[0];
            const mappedMsg: Message = {
                id: m.id,
                chatId: receiver_email,
                sender: sender_email,
                text: trimmedText,
                time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: timestamp,
                read: false
            };
            setMessages(prev => {
                // Evitar duplicados si realtime ya lo insertó
                if (prev.some(msg => msg.id === mappedMsg.id)) return prev;
                return [...prev, mappedMsg];
            });
            return true;
        }

        throw new Error("No se recibió confirmación del servidor");
    };

    const markAsRead = async (chatId: string) => {
        const senderEmail = chatId.toLowerCase();

        // Usar la función RPC para marcar como leídos — respeta la política RLS de UPDATE
        // que solo permite al receiver_email actualizar sus mensajes
        const { error } = await supabase.rpc('mark_as_read', {
            target_sender_email: senderEmail,
            target_receiver_email: normalizedEmail
        });

        if (error) {
            console.error("Error marking as read:", error);
            return;
        }

        // Actualizar estado local inmediatamente
        setMessages(prev => prev.map(m =>
            m.sender === senderEmail && !m.read
                ? { ...m, read: true }
                : m
        ));
    };

    const getChatMessages = (chatId: string) => {
        const normalizedChatId = chatId.toLowerCase();
        return messages.filter(m => m.chatId === normalizedChatId);
    };

    const getUnreadCount = (chatId: string) => {
        const normalizedChatId = chatId.toLowerCase();
        return messages.filter(
            m => m.sender === normalizedChatId && !m.read
        ).length;
    };

    const getTotalUnreadCount = () => {
        return messages.filter(m => m.sender !== normalizedEmail && !m.read).length;
    };

    return {
        messages,
        sendMessage,
        getChatMessages,
        markAsRead,
        getUnreadCount,
        getTotalUnreadCount,
        isSoundEnabled,
        setIsSoundEnabled
    };
};