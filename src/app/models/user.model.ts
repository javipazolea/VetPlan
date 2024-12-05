export interface User {
    id?: string;
    uid: string;
    name: string;
    email: string;
    role: 'usuario' | 'veterinario' | 'admin';
    createdAt?: string;
}