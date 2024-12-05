// src/app/models/veterinario.model.ts
export interface Veterinario {
    id?: string;
    nombre: string;
    email: string;
    rol: 'veterinario';
    // Agrega otros campos que tengas en tu colección de usuarios si son necesarios
}