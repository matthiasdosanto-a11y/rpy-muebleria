import { useState, useEffect } from "react";

export interface Message {
    id: string;
    chatId: string;
    sender: string; // email del remitente
    text: string;
    time: string;
    timestamp: number;
    read?: boolean;
}

export interface ChatThread {
    id: string; // Para chat interno, suele ser el email del otro usuario
    name: string;
    lastMessage?: string;
    time?: string;
    unreadCount: number;
    online: boolean;
}

export const useChat = (currentUserEmail: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    // Cargar mensajes iniciales
    useEffect(() => {
        const stored = localStorage.getItem("rpy_chat_messages");
        if (stored) {
            setMessages(JSON.parse(stored));
        }
    }, []);

    // Sincronización entre pestañas
    useEffect(() => {
        const handleSync = () => {
            const stored = localStorage.getItem("rpy_chat_messages");
            if (stored) {
                const newMessages = JSON.parse(stored);

                // Si el último mensaje es de otro usuario y es nuevo, sonar alerta
                if (newMessages.length > messages.length) {
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.sender !== currentUserEmail && isSoundEnabled) {
                        playNotificationSound();
                    }
                }
                setMessages(newMessages);
            }
        };
        window.addEventListener("storage", handleSync);
        window.addEventListener("chat_updated", handleSync);
        return () => {
            window.removeEventListener("storage", handleSync);
            window.removeEventListener("chat_updated", handleSync);
        };
    }, [messages, currentUserEmail, isSoundEnabled]);

    const playNotificationSound = () => {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked"));
    };

    const sendMessage = (targetChatId: string, text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            chatId: targetChatId,
            sender: currentUserEmail,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            read: false
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem("rpy_chat_messages", JSON.stringify(updatedMessages));
        window.dispatchEvent(new Event("chat_updated"));
    };

    const markAsRead = (chatId: string) => {
        const hasUnread = messages.some(m => m.sender === chatId && m.chatId === currentUserEmail && !m.read);
        if (!hasUnread) return;

        const updatedMessages = messages.map(m =>
            (m.sender === chatId && m.chatId === currentUserEmail)
                ? { ...m, read: true }
                : m
        );
        setMessages(updatedMessages);
        localStorage.setItem("rpy_chat_messages", JSON.stringify(updatedMessages));
        window.dispatchEvent(new Event("chat_updated"));
    };

    const getChatMessages = (chatId: string) => {
        return messages.filter(m => m.chatId === chatId || (m.sender === chatId && m.chatId === currentUserEmail));
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
