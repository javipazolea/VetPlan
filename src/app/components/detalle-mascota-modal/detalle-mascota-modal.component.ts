import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-detalle-mascota-modal',
  templateUrl: './detalle-mascota-modal.component.html'
})
export class DetalleMascotaModalComponent {
  @Input() mascota!: Mascota;
  @Input() dueno: any;
  @Input() citasMascota: Cita[] = [];

  constructor(private modalController: ModalController) {}

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'primary';
      case 'completada': return 'success';
      case 'cancelada': return 'danger';
      default: return 'medium';
    }
  }

  cerrar() {
    this.modalController.dismiss();
  }
}