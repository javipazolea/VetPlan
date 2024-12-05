import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {}

   //
  getDoc(collection: string, id: string): Observable<any> {
    return this.firestore.collection(collection).doc(id).valueChanges();
  }

 // Método para obtener todas las mascotas
getAllMascotas(): Observable<any[]> {
  return this.firestore.collection('mascotas').snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}

  // Obtener mascotas de un usuario
  getMascotasByUserId(userId: string): Observable<any[]> {
    return this.firestore
      .collection('mascotas', ref => ref.where('userId', '==', userId))
      .valueChanges();  // valueChanges() retorna un Observable
  }
  // Agregar una nueva mascota
  addMascota(mascota: any) {
    return this.firestore.collection('mascotas').add(mascota);
  }

  // Editar una mascota
  updateMascota(id: string, mascota: any) {
    return this.firestore.collection('mascotas').doc(id).update(mascota);
  }

  // Eliminar una mascota
  deleteMascota(id: string) {
    return this.firestore.collection('mascotas').doc(id).delete();
  }

  getDocumentsByQuery(
    collection: string,
    queryFn?: (ref: CollectionReference) => Query
  ): Observable<any[]> {
    return this.firestore.collection(collection, queryFn).valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los usuarios
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges({ idField: 'id' });
  }

  // Método para obtener usuarios por rol
  getUsersByRole(role: string): Observable<User[]> {
    return this.firestore.collection<User>('users', ref =>
      ref.where('role', '==', role)
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { ...data, id };
        });
      })
    );
  }


  // Método para obtener todas las citas
  getAllCitas(): Observable<any[]> {
    return this.firestore.collection('citas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Método para actualizar un documento



  updateDoc(collection: string, id: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(id).update(data);
  }

  deleteDoc(collection: string, id: string): Promise<void> {
    return this.firestore.collection(collection).doc(id).delete();
  }



}


