import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../models/mascota.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-mascota-modal',
  templateUrl: './editar-mascota-modal.component.html',
  styleUrls: ['./editar-mascota-modal.component.scss'],
})
export class EditarMascotaModalComponent {
  @Input() mascota!: Mascota;

  constructor(
    private modalController: ModalController,
    private mascotaService: MascotaService,
    private authService: AuthService
  ) {}

  dismiss(data?: any) {
    this.modalController.dismiss(data);
  }

  async guardarCambios() {
    if (this.mascota && this.mascota.id) {
      try {
        // Asegurarse de que el usuarioId se mantiene
        const userId = await this.authService.getUserId();
        if (userId) {
          const mascotaActualizada = {
            ...this.mascota,
            usuarioId: userId
          };
          await this.mascotaService.actualizarMascota(this.mascota.id, mascotaActualizada);
          this.dismiss(mascotaActualizada);
        }
      } catch (error) {
        console.error('Error actualizando mascota:', error);
      }
    }
  }
}