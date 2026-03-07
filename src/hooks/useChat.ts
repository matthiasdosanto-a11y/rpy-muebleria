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

    // Cargar mensajes iniciales desde Supabase
    useEffect(() => {
        if (!currentUserEmail) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .or(`sender_email.eq.${currentUserEmail},receiver_email.eq.${currentUserEmail}`)
                .order('timestamp_ms', { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                return;
            }

            if (data) {
                const mappedMessages: Message[] = data.map(m => ({
                    id: m.id,
                    chatId: m.sender_email === currentUserEmail ? m.receiver_email : m.sender_email,
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
            .channel('public:chat_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `receiver_email=eq.${currentUserEmail}`
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

                setMessages(prev => [...prev, mappedMsg]);
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
    }, [currentUserEmail, isSoundEnabled]);

    const playNotificationSound = () => {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked"));
    };

    const sendMessage = async (targetChatId: string, text: string): Promise<boolean> => {
        const timestamp = Date.now();
        // Aseguramos minúsculas para coincidir con RLS
        const sender_email = currentUserEmail.toLowerCase();
        const receiver_email = targetChatId.toLowerCase();

        const newMessageDB = {
            sender_email,
            receiver_email,
            content: text.trim(),
            timestamp_ms: timestamp,
            is_read: false
        };

        // Insertar en Supabase
        const { data, error } = await supabase
            .from('chat_messages')
            .insert([newMessageDB])
            .select();

        if (error) {
            console.error("Error sending message:", error);
            return false;
        }

        if (data && data[0]) {
            const m = data[0];
            const mappedMsg: Message = {
                id: m.id,
                chatId: receiver_email,
                sender: sender_email,
                text: text.trim(),
                time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: timestamp,
                read: false
            };
            setMessages(prev => [...prev, mappedMsg]);
            return true;
        }
        return false;
    };

    const markAsRead = async (chatId: string) => {
        const unreadIds = messages
            .filter(m => m.sender === chatId && m.chatId === currentUserEmail && !m.read)
            .map(m => m.id);

        if (unreadIds.length === 0) return;

        const { error } = await supabase
            .from('chat_messages')
            .update({ is_read: true })
            .in('id', unreadIds);

        if (error) {
            console.error("Error marking as read:", error);
        } else {
            setMessages(prev => prev.map(m =>
                unreadIds.includes(m.id) ? { ...m, read: true } : m
            ));
        }
    };

    const getChatMessages = (chatId: string) => {
        return messages.filter(m => m.chatId === chatId);
    };

    const getUnreadCount = (chatId: string) => {
        return messages.filter(m => m.sender === chatId && m.chatId === currentUserEmail && !m.read).length;
    };

    const getTotalUnreadCount = () => {
        return messages.filter(m => m.chatId === currentUserEmail && !m.read).length;
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
