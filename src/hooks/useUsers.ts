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
            // 1. Simplificamos la consulta para evitar errores de relación complejos
            const { data: profiles, error: profError } = await supabase
                .from('profiles')
                .select('*');

            const { data: roles, error: rolesError } = await supabase
                .from('roles')
                .select('*');

            if (profError) {
                console.error("Error fetching users:", profError.message);
                return;
            }

            if (profiles) {
                // Creamos un mapa de roles para búsqueda rápida [ID: Nombre]
                const roleMap = new Map(roles?.map(r => [r.id, r.name]) || []);

                const mappedUsers: UserData[] = profiles.map((u: any) => ({
                    id: u.id,
                    // Combinamos nombre y apellido para el frontend
                    nombre: `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.email,
                    email: u.email,
                    // Mapeamos el ID del rol a su nombre en texto usando nuestro mapa
                    rol: roleMap.get(u.role_id) || 'Vendedor',
                    estado: u.estado,
                    password: u.password_hint || ''
                }));

                console.log("Usuarios cargados en frontend:", mappedUsers);
                setUsers(mappedUsers);
            }
        };

        fetchUsers();

        // Suscribirse a cambios en la tabla profiles
        const channel = supabase
            .channel('public:profiles_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchUsers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addUser = async (u: UserData) => {
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

        if (error) {
            console.error("Error adding user:", error.message);
            throw error;
        }
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

        if (error) {
            console.error("Error updating user:", error.message);
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting user:", error.message);
            throw error;
        }
    };

    return {
        users,
        addUser,
        updateUser,
        deleteUser
    };
};
