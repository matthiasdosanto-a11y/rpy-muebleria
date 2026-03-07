import { useState, useEffect } from "react";

export interface UserData {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    password?: string;
}

const DEFAULT_USERS: UserData[] = [
    { id: "1", nombre: "Administrador", email: "admin@rpymuebleria.com", rol: "Administrador", estado: "Activo", password: "AdminPassword123" },
    { id: "2", nombre: "Vendedor2", email: "vendedor2@rpymuebleria.com", rol: "Vendedor", estado: "Activo", password: "VendedorPassword2" },
];

export const useUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("rpy_users");
        if (stored) {
            setUsers(JSON.parse(stored));
        } else {
            setUsers(DEFAULT_USERS);
            localStorage.setItem("rpy_users", JSON.stringify(DEFAULT_USERS));
        }
    }, []);

    const saveUsers = (newUsers: UserData[]) => {
        setUsers(newUsers);
        localStorage.setItem("rpy_users", JSON.stringify(newUsers));
        window.dispatchEvent(new Event("users_updated"));
    };

    useEffect(() => {
        const handleSync = () => {
            const stored = localStorage.getItem("rpy_users");
            if (stored) setUsers(JSON.parse(stored));
        };
        window.addEventListener("users_updated", handleSync);
        return () => window.removeEventListener("users_updated", handleSync);
    }, []);

    const addUser = (u: UserData) => {
        const newUsers = [...users, u];
        saveUsers(newUsers);
    };

    const updateUser = (id: string, updatedFields: Partial<UserData>) => {
        const newUsers = users.map(u => u.id === id ? { ...u, ...updatedFields } : u);
        saveUsers(newUsers);
    };

    const deleteUser = (id: string) => {
        const newUsers = users.filter(u => u.id !== id);
        saveUsers(newUsers);
    };

    return {
        users,
        addUser,
        updateUser,
        deleteUser
    };
};
