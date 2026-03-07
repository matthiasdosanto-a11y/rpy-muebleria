import { useState, useEffect, useRef } from "react";
import { User, Paperclip, Send, Search, MessageSquare, Volume2, VolumeX, Check, CheckCheck, Users } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useUsers } from "@/hooks/useUsers";
import { supabase } from "@/lib/supabaseClient";

export const Soporte = () => {
    const [currentUserEmail, setCurrentUserEmail] = useState("vendedor2@rpymuebleria.com");
    const { users } = useUsers();
    const { sendMessage, getChatMessages, isSoundEnabled, setIsSoundEnabled, messages, markAsRead, getUnreadCount } = useChat(currentUserEmail);

    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentUser = users.find(u => u.email === currentUserEmail);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user?.email) setCurrentUserEmail(data.session.user.email);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (activeChatId) {
            markAsRead(activeChatId);
        }
    }, [activeChatId, messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeChatId]);

    const otherUsers = users.filter(u => u.email !== currentUserEmail);

    const threads = otherUsers.map(u => {
        const chatMsgs = messages.filter(m =>
            (m.chatId === u.email && m.sender === currentUserEmail) ||
            (m.chatId === currentUserEmail && m.sender === u.email)
        );
        const lastMsg = chatMsgs[chatMsgs.length - 1];

        return {
            id: u.email,
            name: u.nombre,
            rol: u.rol,
            lastMessage: lastMsg?.text || "Sin mensajes aún",
            time: lastMsg?.time || "",
            online: u.estado === "Activo",
            unreadCount: getUnreadCount(u.email)
        };
    }).filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentChat = threads.find(t => t.id === activeChatId);
    const activeMessages = activeChatId ? getChatMessages(activeChatId) : [];

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChatId) return;
        sendMessage(activeChatId, messageInput);
        setMessageInput("");
    };

    return (
        <div className="bg-[#f0f2f5] border border-gray-200 rounded-xl shadow-lg h-[calc(100vh-140px)] flex overflow-hidden">
            {/* SIDEBAR */}
            <div className="w-80 sm:w-96 border-r border-gray-300 flex flex-col bg-white">
                <div className="p-4 bg-[#f0f2f5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                            <Users size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm">Lista de Contactos</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                    >
                        {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>

                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar contacto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-1.5 bg-[#f0f2f5] border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {threads.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`px-4 py-3 flex gap-3 cursor-pointer transition-all border-b border-gray-50 ${activeChatId === chat.id ? 'bg-[#f0f2f5]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-100">
                                    <User size={24} />
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25d366] rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 pb-2 border-b border-gray-100">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-[15px] font-semibold text-gray-900 truncate">{chat.name}</h4>
                                    <span className="text-[11px] text-gray-500">{chat.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-[#25d366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ÁREA DE CONVERSACIÓN */}
            <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
                {currentChat ? (
                    <>
                        <div className="h-16 px-4 bg-[#f0f2f5] flex items-center justify-between z-10 border-b border-gray-300 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-[16px]">{currentChat.name}</h3>
                                    <p className="text-[12px] text-gray-500 font-medium">
                                        {currentChat.online ? "En línea" : "Desconectado"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-2 flex flex-col">
                            {activeMessages.map((msg) => {
                                const isMe = msg.sender === currentUserEmail;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-1.5 shadow-sm relative ${isMe ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="text-[14.5px] leading-relaxed pr-8">{msg.text}</p>
                                            <div className="flex items-center justify-end gap-1 mt-0.5">
                                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                                                {isMe && (msg.read ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} className="text-gray-400" />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-3 bg-[#f0f2f5] flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                                <Paperclip size={24} />
                            </button>
                            <form onSubmit={handleSend} className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 py-2.5 px-4 bg-white rounded-lg text-sm focus:outline-none shadow-sm placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:bg-gray-400"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center max-w-sm px-6">
                            <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <MessageSquare size={48} className="text-primary/30" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2 font-whatsapp">RPY Chat Interno</h3>
                            <p className="text-sm text-gray-500">Selecciona un contacto para comenzar una conversación segura con el equipo de RPY.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
