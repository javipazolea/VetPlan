// src/app/services/veterinario.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Veterinario } from '../models/veterinario.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  constructor(private firestore: AngularFirestore) {}

  getVeterinarios(): Observable<Veterinario[]> {
    return this.firestore.collection('users', ref => 
      ref.where('role', '==', 'veterinario')
    ).valueChanges({ idField: 'id' })
    .pipe(
      map(users => users as Veterinario[])
    );
  }

  getVeterinarioById(id: string): Observable<Veterinario | undefined> {
    return this.firestore.doc<Veterinario>(`users/${id}`).valueChanges();
  }
}