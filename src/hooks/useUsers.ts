import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface UserData {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    password?: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    roles:role_id (name)
                `);

            if (error) {
                console.error("Error fetching users:", error);
                return;
            }

            if (data) {
                const mappedUsers: UserData[] = data.map((u: any) => ({
                    id: u.id,
                    // Combinamos nombre y apellido para el frontend
                    nombre: `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.email,
                    email: u.email,
                    // Mapeamos el ID del rol a su nombre en texto
                    rol: u.roles?.name || 'Vendedor',
                    estado: u.estado,
                    password: u.password_hint || ''
                }));
                setUsers(mappedUsers);
            }
        };

        fetchUsers();

        // Suscribirse a cambios en la tabla profiles
        const channel = supabase
            .channel('public:profiles_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                // Para simplificar y asegurar que traemos la relación de roles correcta,
                // refrescamos la lista completa al haber cambios.
                fetchUsers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addUser = async (u: UserData) => {
        // Mapeo simple de Nombre Completo a Nombre/Apellido para demostrar
        const names = u.nombre.split(' ');
        const nombre = names[0];
        const apellido = names.slice(1).join(' ');

        const { error } = await supabase
            .from('profiles')
            .insert([{
                nombre,
                apellido,
                email: u.email,
                role_id: u.rol.toLowerCase() === 'admin' ? 1 : 2,
                estado: u.estado
            }]);

        if (error) console.error("Error adding user:", error);
    };

    const updateUser = async (id: string, updatedFields: Partial<UserData>) => {
        const updateData: any = {
            email: updatedFields.email,
            estado: updatedFields.estado
        };

        if (updatedFields.nombre) {
            const names = updatedFields.nombre.split(' ');
            updateData.nombre = names[0];
            updateData.apellido = names.slice(1).join(' ');
        }

        if (updatedFields.rol) {
            updateData.role_id = updatedFields.rol.toLowerCase() === 'admin' ? 1 : 2;
        }

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id);

        if (error) console.error("Error updating user:", error);
    };

    const deleteUser = async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) console.error("Error deleting user:", error);
    };

    return {
        users,
        addUser,
        updateUser,
        deleteUser
    };
};
