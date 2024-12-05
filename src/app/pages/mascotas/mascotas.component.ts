// mascotas.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';  // Importa Subscription para gestionar la suscripción
import { CitasService } from 'src/app/services/citas.service';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss'],
})
export class MascotasComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  isAdmin: boolean = false;
  mascotas: any[] = [];
  mascotasSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public router: Router,
    private citasService: CitasService,
  ) {}

  async ngOnInit() {
    this.userId = await this.authService.getUserId();
    this.isAdmin = await this.authService.isAdmin();
    if (this.userId) {
      this.mascotasSubscription = this.firestoreService.getMascotasByUserId(this.userId).subscribe((data) => {
        this.mascotas = data;
      });
    }

    // Usamos 'userId!' para indicar que no será null
    if (this.isAdmin) {
      this.mascotasSubscription = this.firestoreService.getAllMascotas().subscribe((data) => {
        this.mascotas = data;
      });
    } else {
      if (this.userId) {
        this.mascotasSubscription = this.firestoreService.getMascotasByUserId(this.userId!).subscribe((data) => {
          this.mascotas = data;
        });
      } else {
        console.error("El ID del usuario es null");
      }
    }
  }

  ngOnDestroy() {
    if (this.mascotasSubscription) {
      this.mascotasSubscription.unsubscribe();
    }
  }
  addMascota() {
    this.router.navigate(['/agregar-mascota']); // Redirige a la página de agregar mascota
  }

  editMascota(id: string) {
    this.router.navigate(['/editar-mascota', id]);
  }

  async deleteMascota(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      await this.firestoreService.deleteMascota(id);
      if (this.userId) {
        if (this.isAdmin) {
          this.mascotasSubscription = this.firestoreService.getAllMascotas().subscribe((data) => {
            this.mascotas = data;
          });
        } else {
          this.mascotasSubscription = this.firestoreService.getMascotasByUserId(this.userId!).subscribe((data) => {
            this.mascotas = data;
          });
        }
      }
    }
  }
}
