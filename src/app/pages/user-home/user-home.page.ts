import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EditarMascotaModalComponent } from '../../components/editar-mascota-modal/editar-mascota-modal.component';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../models/mascota.model';
import { AuthService } from '../../services/auth.service';
import { CitasService } from '../../services/citas.service';
import { Cita } from '../../models/cita.model';
import { NuevaCitaModalComponent } from '../../components/nueva-cita-modal/nueva-cita-modal.component';
import { VeterinarioService } from '../../services/veterinario.service';
import { Veterinario } from '../../models/veterinario.model';
import { EditarCitaModalComponent } from '../../components/editar-cita-modal/editar-cita-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  mascotas: Mascota[] = [];
  userName: string = 'Usuario'; // Valor por defecto
  segmentValue: string = 'mascotas';
  selectedDate: string = new Date().toISOString();
  misCitas: Cita[] = [];
  citasDelDia: Cita[] = [];
  veterinarios: Veterinario[] = [];

  constructor(
    private modalController: ModalController,
    private mascotaService: MascotaService,
    private citasService: CitasService,
    private authService: AuthService,
    private alertController: AlertController,
    private veterinarioService: VeterinarioService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarDatos();
    this.cargarMascotas();
    this.cargarVeterinarios();
    
  }

  cargarVeterinarios() {
    this.veterinarioService.getVeterinarios().subscribe(vets => {
      this.veterinarios = vets;
      console.log('Veterinarios cargados:', this.veterinarios); // Para debug
    });
  }


  getVeterinarioInfo(veterinarioId: string): Veterinario | undefined {
    const veterinario = this.veterinarios.find(vet => vet.id === veterinarioId);
    console.log('Buscando veterinario:', veterinarioId, 'Encontrado:', veterinario); // Para debug
    return veterinario;
  }

  async cargarDatos() {
    const userId = await this.authService.getUserId();
    if (userId) {
      this.cargarMascotas();
      this.cargarCitas(userId);
    }
  }
  async cargarDatosUsuario() {
    try {
      this.userName = await this.authService.getUserName();
    } catch (error) {
      console.error('Error al cargar el nombre del usuario:', error);
    }
  }
  async cargarMascotas() {
    const userId = await this.authService.getUserId();
    if (userId) {
      this.mascotaService.obtenerMascotasPorUsuarioId(userId)
        .subscribe(mascotas => {
          this.mascotas = mascotas;
        });
    }
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  async cargarCitas(userId: string) {
    this.citasService.getCitas().subscribe(citas => {
      // Filtrar citas por usuario y ordenar por fecha
      this.misCitas = citas
        .filter(cita => cita.usuarioId === userId)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      this.actualizarCitasDelDia();
    });
  }
  onDateChanged(event: any) {
    this.selectedDate = event.detail.value;
    this.actualizarCitasDelDia();
  }

  actualizarCitasDelDia() {
    const fechaSeleccionada = new Date(this.selectedDate).setHours(0, 0, 0, 0);
    this.citasDelDia = this.misCitas.filter(cita => {
      const fechaCita = new Date(cita.fecha).setHours(0, 0, 0, 0);
      return fechaCita === fechaSeleccionada;
    });
  }

  getMascotaInfo(mascotaId: string): Mascota | undefined {
    return this.mascotas.find(mascota => mascota.id === mascotaId);
  }

  async eliminarCita(cita: Cita) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar esta cita?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (cita.id) {
              try {
                await this.citasService.deleteCita(cita.id);
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'La cita ha sido eliminada correctamente',
                  buttons: ['OK']
                });
                await successAlert.present();
              } catch (error) {
                console.error('Error al eliminar la cita:', error);
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'No se pudo eliminar la cita. Por favor, intenta nuevamente.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async abrirModalEdicion(mascota: Mascota) {
    const modal = await this.modalController.create({
      component: EditarMascotaModalComponent,
      componentProps: {
        mascota: { ...mascota }
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.cargarMascotas();
    }
  }
  // Añade este nuevo método
  async eliminarMascota(mascota: Mascota) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar a ${mascota.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              if (mascota.id) {
                await this.mascotaService.eliminarMascota(mascota.id);
                console.log('Mascota eliminada exitosamente');
                
                // Forzar la recarga de las mascotas
                await this.cargarMascotas();
                
                // Mostrar mensaje de éxito
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'La mascota ha sido eliminada correctamente',
                  buttons: ['OK']
                });
                await successAlert.present();
              }
            } catch (error) {
              console.error('Error al eliminar mascota:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar la mascota. Por favor, intenta nuevamente.',
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
  async abrirModalNuevaCita() {
    const modal = await this.modalController.create({
      component: NuevaCitaModalComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data && data.success) {
      // Recargar las citas cuando se crea una nueva
      const userId = await this.authService.getUserId();
      if (userId) {
        this.cargarCitas(userId);
      }
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'La cita ha sido agendada correctamente',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async editarCita(cita: Cita) {
    const modal = await this.modalController.create({
      component: EditarCitaModalComponent,
      componentProps: {
        cita: { ...cita },
        veterinarios: this.veterinarios
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data && data.success) {
      const userId = await this.authService.getUserId();
      if (userId) {
        this.cargarCitas(userId);
      }
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'La cita ha sido actualizada correctamente',
        buttons: ['OK']
      });
      await alert.present();
    }
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