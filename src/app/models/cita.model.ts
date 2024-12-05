export interface Cita {
    id?: string;
    mascotaId: string; // ID de la mascota relacionada
    usuarioId: string; // ID del usuario dueño de la mascota
    veterinarioId: string; // ID del veterinario que atenderá
    fecha: string; // Fecha de la cita en formato ISO
    motivo: string;
    estado: 'pendiente' | 'completada' | 'cancelada';
}