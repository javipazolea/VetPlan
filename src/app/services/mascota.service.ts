import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Mascota } from '../models/mascota.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private mascotasCollection = this.firestore.collection<Mascota>('mascotas');

  constructor(private firestore: AngularFirestore) {}

  // Crear una nueva mascota asociada a un usuario
  crearMascota(mascota: Mascota): Promise<void> {
    const id = this.firestore.createId();
    return this.mascotasCollection.doc(id).set({ ...mascota, id });
  }

  // Obtener las mascotas de un usuario (filtradas por userId)
  obtenerMascotasPorUsuarioId(usuarioId: string): Observable<Mascota[]> {
    return this.firestore.collection<Mascota>('mascotas', ref => 
      ref.where('usuarioId', '==', usuarioId)
    ).valueChanges({ idField: 'id' });
  }

  // Obtener todas las mascotas (para Admin)
  obtenerTodasLasMascotas(): Observable<Mascota[]> {
    return this.mascotasCollection.valueChanges({ idField: 'id' });
  }

  // Obtener una mascota por su ID
  obtenerMascotaPorId(id: string): Observable<Mascota | undefined> {
    return this.mascotasCollection.doc<Mascota>(id).valueChanges();
  }

  // Actualizar una mascota
  actualizarMascota(id: string, mascota: Mascota): Promise<void> {
    return this.mascotasCollection.doc(id).update(mascota);
  }

  // Eliminar una mascota - Método actualizado
  async eliminarMascota(id: string): Promise<void> {
    try {
      // Verificar que el documento existe antes de intentar eliminarlo
      const docRef = this.mascotasCollection.doc(id);
      const doc = await docRef.get().toPromise();
      
      if (doc && doc.exists) {
        await docRef.delete();
        console.log(`Mascota con ID ${id} eliminada correctamente`);
        return Promise.resolve();
      } else {
        console.error(`No se encontró la mascota con ID ${id}`);
        return Promise.reject(new Error('Documento no encontrado'));
      }
    } catch (error) {
      console.error('Error al eliminar la mascota:', error);
      return Promise.reject(error);
    }
  }
}