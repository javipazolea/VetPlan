import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cita } from '../../models/cita.model';
import { Mascota } from '../../models/mascota.model';

@Component({
  selector: 'app-detalle-cita-modal',
  templateUrl: './detalle-cita-modal.component.html'
})
export class DetalleCitaModalComponent {
  @Input() cita!: Cita;
  @Input() mascota?: Mascota;
  @Input() dueno: any;

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

  async cambiarEstado() {
    this.modalController.dismiss({
      action: 'cambiarEstado',
      cita: this.cita
    });
  }

  cerrar() {
    this.modalController.dismiss();
  }
}