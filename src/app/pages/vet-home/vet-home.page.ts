import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CitasService } from '../../services/citas.service';
import { AuthService } from '../../services/auth.service';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';
import { AlertController, ModalController } from '@ionic/angular';
import { DetalleMascotaModalComponent } from '../../components/detalle-mascota-modal/detalle-mascota-modal.component';
import { DetalleCitaModalComponent } from '../../components/detalle-cita-modal/detalle-cita-modal.component';
import { Router } from '@angular/router';
// Agregar interface para Usuario
interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-vet-home',
  templateUrl: './vet-home.page.html',
  styleUrls: ['./vet-home.page.scss'],
})
export class VetHomePage implements OnInit {
  citas: Cita[] = [];
  mascotas: Mascota[] = [];
  usuarios: Usuario[] = [];//Para almacenar la información de los dueños
  segmentValue: string = 'calendario';
  vetId: string | null = null;
  selectedDate: string = new Date().toISOString();
  citasDelDia: Cita[] = [];
  citasFiltradas: Cita[] = [];
estadoFiltro: string = 'todos';

  constructor(
    private firestoreService: FirestoreService,
    private citasService: CitasService,
    public authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.vetId = await this.authService.getUserId();
    if (this.vetId) {
      this.loadData();
    }
  }

  async loadData() {
    this.loadCitasVeterinario();
    this.loadMascotasConCitas();
  }

  loadCitasVeterinario() {
    if (this.vetId) {
      this.citasService.getCitas().subscribe(
        (citas) => {
          this.citas = citas.filter(cita => cita.veterinarioId === this.vetId)
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          this.filtrarCitas(); // Llamar al filtro cada vez que se cargan las citas
          this.actualizarCitasDelDia();
          this.cargarInformacionUsuarios();
        },
        (error) => {
          console.error('Error al cargar citas:', error);
        }
      );
    }
  }
  
  // Agregar método de filtrado
  filtrarCitas() {
    if (this.estadoFiltro === 'todos') {
      this.citasFiltradas = this.citas;
    } else {
      this.citasFiltradas = this.citas.filter(cita => cita.estado === this.estadoFiltro);
    }
  }
  
  // Método para manejar cambio de filtro
  onFiltroChange(event: any) {
    this.estadoFiltro = event.detail.value;
    this.filtrarCitas();
  }
  loadMascotasConCitas() {
    if (this.vetId) {
      this.citasService.getCitas().subscribe(citasVet => {
        // Obtener IDs únicos de mascotas que tienen citas con este veterinario
        const mascotasIds = [...new Set(citasVet
          .filter(cita => cita.veterinarioId === this.vetId)
          .map(cita => cita.mascotaId))];

        // Cargar información de estas mascotas
        this.firestoreService.getAllMascotas().subscribe(
          todasLasMascotas => {
            this.mascotas = todasLasMascotas.filter(mascota => 
              mascotasIds.includes(mascota.id || '')
            );
          }
        );
      });
    }
  }

  cargarInformacionUsuarios() {
    // Obtener IDs únicos de usuarios
    const userIds = [...new Set(this.mascotas.map(mascota => mascota.usuarioId))];
    
    // Cargar información de cada usuario
    userIds.forEach(userId => {
      this.firestoreService.getDoc('users', userId).subscribe(
        userData => {
          const index = this.usuarios.findIndex(u => u.id === userId);
          if (index === -1) {
            this.usuarios.push({ id: userId, ...userData });
          } else {
            this.usuarios[index] = { id: userId, ...userData };
          }
        }
      );
    });
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  onDateChanged(event: any) {
    this.selectedDate = event.detail.value;
    this.actualizarCitasDelDia();
  }

  actualizarCitasDelDia() {
    const fechaSeleccionada = new Date(this.selectedDate).setHours(0,0,0,0);
    this.citasDelDia = this.citas.filter(cita => {
      const fechaCita = new Date(cita.fecha).setHours(0,0,0,0);
      return fechaCita === fechaSeleccionada;
    });
  }

  getMascotaInfo(mascotaId: string): Mascota | undefined {
    return this.mascotas.find(mascota => mascota.id === mascotaId);
  }

  getUserInfo(userId: string): any {
    return this.usuarios.find(user => user.id === userId);
  }


  async verDetalleCita(cita: Cita) {
    const mascota = this.getMascotaInfo(cita.mascotaId);
    const dueno = this.getUserInfo(mascota?.usuarioId || '');
    
    const modal = await this.modalController.create({
      component: DetalleCitaModalComponent,
      componentProps: {
        cita,
        mascota,
        dueno
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.action === 'cambiarEstado') {
        this.cambiarEstadoCita(result.data.cita);
      }
    });

    await modal.present();
  }
  

  // Agregar este método para obtener el color según el estado
getColorEstado(estado: string): string {
  switch (estado) {
    case 'pendiente':
      return 'warning';
    case 'en_proceso':
      return 'primary';
    case 'completada':
      return 'success';
    case 'cancelada':
      return 'danger';
    default:
      return 'medium';
  }
}

// Agregar método para ver detalles de mascota
async verDetalleMascota(mascota: Mascota) {
  const dueno = this.getUserInfo(mascota.usuarioId);
  const citasMascota = this.citas.filter(cita => cita.mascotaId === mascota.id);
  
  const modal = await this.modalController.create({
    component: DetalleMascotaModalComponent,
    componentProps: {
      mascota,
      dueno,
      citasMascota
    }
  });

  await modal.present();
}

async cambiarEstadoCita(cita: Cita) {
  const alert = await this.alertController.create({
    header: 'Cambiar Estado',
    inputs: [
      {
        name: 'estado',
        type: 'radio',
        label: 'Pendiente',
        value: 'pendiente',
        checked: cita.estado === 'pendiente'
      },
      {
        name: 'estado',
        type: 'radio',
        label: 'Completada',
        value: 'completada',
        checked: cita.estado === 'completada'
      },
      {
        name: 'estado',
        type: 'radio',
        label: 'Cancelada',
        value: 'cancelada',
        checked: cita.estado === 'cancelada'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Guardar',
        handler: (data) => {
          if (cita.id) {
            this.citasService.updateCita(cita.id, { estado: data });
          }
        }
      }
    ]
  });

  await alert.present();
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