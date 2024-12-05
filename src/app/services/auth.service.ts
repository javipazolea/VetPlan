import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  // Registro
  async register(email: string, password: string, name: string, role: string) {
    try {
      console.log('Iniciando registro con:', { email, name, role });
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      console.log('Usuario creado con uid:', uid);
      
      const userData = {
        name,
        email,
        role,
        uid,
        createdAt: new Date().toISOString()
      };
      
      await this.firestore.collection('users').doc(uid).set(userData);
      console.log('Datos de usuario guardados en Firestore:', userData);
      return userData;
    } catch (error) {
      console.error("Error en el registro", error);
      throw error;
    }
  }

//obtener rol del usuario
async getUserRole(uid: string): Promise<string> {
  const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
  const userData = userDoc?.data();
  return (userData as any).role || 'usuario';
}


  // Inicio de sesión
  async loginUser(email: string, password: string): Promise<void> {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    const uid = userCredential.user?.uid;
  
    if (uid) {
      const role = await this.getUserRole(uid); // Obtiene el rol desde Firestore
      if (role === 'usuario') {
        this.router.navigate(['/user-home']);
      } else if (role === 'veterinario') {
        this.router.navigate(['/vet-home']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin-home']);
      }
    }
  }
  

  // Recuperar contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      const userExists = await this.checkIfUserExists(email);
      if (!userExists) {
        throw new Error('auth/user-not-found');
      }
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  }
  
  private async checkIfUserExists(email: string): Promise<boolean> {
    const usersRef = this.firestore.collection('users', ref => ref.where('email', '==', email));
    const snapshot = await usersRef.get().toPromise();
  
    // Verifica si el snapshot existe y tiene documentos
    return snapshot ? !snapshot.empty : false;
  }

  // Cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  // Obtiene el rol del usuario actual desde Firestore
  async getCurrentUserRole(): Promise<string> {
    const user = await this.afAuth.currentUser;

    if (user) {
      const uid = user.uid;
      const userDoc = await this.firestore.collection('users').doc(uid).ref.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return (userData as any).role || 'usuario';// Retorna el rol, o 'usuario' como predeterminado
      }
    }

    return 'usuario'; // Si no se encuentra el usuario, se asume un rol predeterminado
  }

  async getUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null; // Retorna el UID del usuario si está autenticado, o null si no lo está.
  }

  async isAdmin(): Promise<boolean> {
    const userId = await this.getUserId(); // Obtiene el UID del usuario
    if (userId) {
      const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
      const userData = userDoc?.data();
      return (userData as any).role === 'admin'; // Verifica si el rol es 'admin'
    }
    return false;
  }

  // nombre ususario saludo personalizado
  async getUserName(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        const userDoc = await this.firestore
          .collection('users')  // Cambiado de 'usuarios' a 'users'
          .doc(user.uid)
          .get()
          .toPromise();
        
        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as { name?: string, email?: string };
          // Cambiado de nombre a name para coincidir con tu estructura en Firebase
          return userData.name || userData.email || 'Usuario';
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }
    }
    return 'Usuario';
  }
}

