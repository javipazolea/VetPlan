import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { RegistrarVeterinarioModalComponent } from '../../components/registrar-veterinario-modal/registrar-veterinario-modal.component';
import { CollectionReference, Query } from '@angular/fire/compat/firestore';
import {  forkJoin } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
})
export class AdminHomePage implements OnInit {
  segmentValue: string = 'veterinarios';
  veterinarios: User[] = [];
  usuarios: User[] = [];
  mascotas: any[] = [];
  citas: any[] = [];
  estadisticas = {
    totalUsuarios: 0,
    totalMascotas: 0,
    totalCitas: 0,
    veterinariosActivos: 0,
    citasPendientes: 0,
    citasCompletadas: 0,
    citasCanceladas: 0
  };
  ultimoRespaldo: Date = new Date();

// Agregar esta propiedad
loading: boolean = true;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private modalController: ModalController,
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    console.log('Iniciando carga de datos');
    this.loading = true;

    // Primero, obtener veterinarios directamente
    this.firestoreService.getUsersByRole('veterinario').subscribe({

      next: (vets) => {
        console.log('Veterinarios encontrados:', vets);
        this.veterinarios = vets;
        this.estadisticas.veterinariosActivos = vets.length;
        this.loading = false;
    this.changeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error cargando veterinarios:', error)

    });



    // Luego, obtener usuarios
    this.firestoreService.getUsersByRole('usuario').subscribe({
      next: (users) => {
        console.log('Usuarios encontrados:', users);
        this.usuarios = users;
        this.estadisticas.totalUsuarios = users.length;
        this.loading = false;
    this.changeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error cargando usuarios:', error)
    });

    // Obtener mascotas
    this.firestoreService.getAllMascotas().subscribe({
      next: (mascotas) => {
        console.log('Mascotas encontradas:', mascotas);
        this.mascotas = mascotas;
        this.estadisticas.totalMascotas = mascotas.length;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error cargando mascotas:', error)
    });


    // Obtener citas
    this.firestoreService.getAllCitas().subscribe({
      next: (citas) => {
        console.log('Citas encontradas:', citas);
        this.citas = citas;
        this.estadisticas.totalCitas = citas.length;
        this.estadisticas.citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
        this.estadisticas.citasCompletadas = citas.filter(c => c.estado === 'completada').length;
        this.estadisticas.citasCanceladas = citas.filter(c => c.estado === 'cancelada').length;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error cargando citas:', error)
    });

  }
  actualizarEstadisticas() {
    this.estadisticas = {
      totalUsuarios: this.usuarios.length,
      totalMascotas: this.mascotas.length,
      totalCitas: this.citas.length,
      veterinariosActivos: this.veterinarios.length,
      citasPendientes: this.citas.filter(c => c.estado === 'pendiente').length,
      citasCompletadas: this.citas.filter(c => c.estado === 'completada').length,
      citasCanceladas: this.citas.filter(c => c.estado === 'cancelada').length
    };
  }

  cargarVeterinarios() {
    this.firestoreService.getDocumentsByQuery('users',
      (ref: CollectionReference) => ref.where('rol', '==', 'veterinario') as Query
    ).subscribe(veterinarios => {
      this.veterinarios = veterinarios;
      console.log('Veterinarios cargados:', veterinarios);
    });
  }
  cargarEstadisticas() {
    // Cargar usuarios (solo rol usuario)
    const usuarios$ = this.firestoreService.getDocumentsByQuery('users',
      (ref: CollectionReference) => ref.where('rol', '==', 'usuario') as Query
    );

    // Cargar todas las mascotas
    const mascotas$ = this.firestoreService.getDocumentsByQuery('mascotas');

    // Cargar todas las citas
    const citas$ = this.firestoreService.getDocumentsByQuery('citas');

    forkJoin({
      usuarios: usuarios$,
      mascotas: mascotas$,
      citas: citas$
    }).subscribe(({usuarios, mascotas, citas}) => {
      this.usuarios = usuarios;
      this.mascotas = mascotas;
      this.citas = citas;

      // Actualizar estadísticas
      this.estadisticas.totalUsuarios = usuarios.length;
      this.estadisticas.totalMascotas = mascotas.length;
      this.estadisticas.totalCitas = citas.length;

      // Calcular estadísticas de citas
      this.estadisticas.citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
      this.estadisticas.citasCompletadas = citas.filter(c => c.estado === 'completada').length;
      this.estadisticas.citasCanceladas = citas.filter(c => c.estado === 'cancelada').length;
    });
  }
// Método para calcular citas por veterinario
getCitasVeterinario(vetId: string): number {
  console.log('Buscando citas para veterinario:', vetId);
  const citasVet = this.citas.filter(cita => cita.veterinarioId === vetId);
  console.log('Citas encontradas:', citasVet);
  return citasVet.length;
}

// Método para obtener mascotas por veterinario
getMascotasVeterinario(vetId: string): number {
  console.log('Buscando mascotas para veterinario:', vetId);
  const citasVet = this.citas.filter(cita => cita.veterinarioId === vetId);
  const mascotasIds = [...new Set(citasVet.map(cita => cita.mascotaId))];
  console.log('Mascotas únicas encontradas:', mascotasIds);
  return mascotasIds.length;
}

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  async presentRegistroVeterinario() {
    const modal = await this.modalController.create({
      component: RegistrarVeterinarioModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.success) {
        this.cargarDatos(); // Recargar datos después de registrar
      }
    });

    return await modal.present();
  }




  async desactivarVeterinario(veterinario: User) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar al veterinario ${veterinario.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: async () => {
            try {
              await this.firestoreService.deleteDoc('users', veterinario.id!);

              // Recargar datos
              await this.cargarDatos();

              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Veterinario eliminado correctamente',
                buttons: ['OK']
              });
              await successAlert.present();
            } catch (error) {
              console.error('Error al eliminar veterinario:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar el veterinario. Por favor, intente nuevamente.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async generarRespaldo() {
    // Implementar lógica para generar respaldo
    this.ultimoRespaldo = new Date();
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            try {
              await this.authService.logout();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
