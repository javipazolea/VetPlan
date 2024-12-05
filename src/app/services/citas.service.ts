import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todas las citas
  getCitas(): Observable<any[]> {
    return this.firestore.collection('citas').valueChanges({ idField: 'id' });
  }

  // Obtener las citas por id de mascota
  getCitasByMascotaId(mascotaId: string): Observable<any[]> {
    return this.firestore.collection('citas', ref =>
      ref.where('mascotaId', '==', mascotaId)
    ).valueChanges({ idField: 'id' });
  }

  // Crear una cita
  createCita(cita: any): Promise<any> {
    return this.firestore.collection('citas').add(cita);
  }

  // Actualizar una cita
  updateCita(citaId: string, data: any): Promise<void> {
    return this.firestore.collection('citas').doc(citaId).update(data);
  }

  // Eliminar una cita
  deleteCita(citaId: string): Promise<void> {
    return this.firestore.collection('citas').doc(citaId).delete();
  }
}