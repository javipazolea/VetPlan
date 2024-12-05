export interface Mascota {
    id?: string;  // El ID será generado por el sistema
    nombre: string;
    especie: string; // Ej. Perro, Gato
    raza: string;
    edad: number; // Edad en años
    usuarioId: string; // ID del usuario que tiene la mascota
    fechaNacimiento: string; // Fecha de nacimiento (en formato YYYY-MM-DD)
}