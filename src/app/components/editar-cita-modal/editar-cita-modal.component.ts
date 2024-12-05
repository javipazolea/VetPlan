import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';
import { MascotaService } from '../../services/mascota.service';
import { Veterinario } from '../../models/veterinario.model';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-editar-cita-modal',
  templateUrl: './editar-cita-modal.component.html',
  styleUrls: ['./editar-cita-modal.component.scss']
})
export class EditarCitaModalComponent implements OnInit {
  @Input() cita!: Cita;
  mascotas: Mascota[] = [];
  horasDisponibles: string[] = [];
  citasExistentes: Cita[] = [];

  minDate = new Date().toISOString();
  maxDate = new Date();

  editandoCita = {
    mascotaId: '',
    fecha: '',
    hora: '',
    motivo: ''
  };

  constructor(
    private modalController: ModalController,
  
    private citasService: CitasService,
    private mascotaService: MascotaService
  ) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);
  }

  ngOnInit() {
    this.cargarDatos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const fechaCita = new Date(this.cita.fecha);
    this.editandoCita = {
      mascotaId: this.cita.mascotaId,
      fecha: this.cita.fecha,
      hora: `${fechaCita.getHours().toString().padStart(2, '0')}:00`,
      motivo: this.cita.motivo
    };
    this.generarHorasDisponibles();
  }

  async cargarDatos() {
    // Cargar veterinarios si no fueron proporcionados
    if (this.cita.usuarioId) {
      this.mascotaService.obtenerMascotasPorUsuarioId(this.cita.usuarioId).subscribe(
        mascotas => this.mascotas = mascotas
      );
    }
    // Cargar mascotas del usuario
    if (this.cita.usuarioId) {
      this.mascotaService.obtenerMascotasPorUsuarioId(this.cita.usuarioId).subscribe(
        mascotas => this.mascotas = mascotas
      );
    }

    // Cargar otras citas para validar disponibilidad
    this.citasService.getCitas().subscribe(
      citas => {
        this.citasExistentes = citas.filter(c => c.id !== this.cita.id); // Excluir la cita actual
      }
    );
  }

  generarHorasDisponibles() {
    const horas = [];
    for (let hora = 9; hora < 18; hora++) {
      horas.push(`${hora.toString().padStart(2, '0')}:00`);
    }
    this.horasDisponibles = horas;
    this.verificarDisponibilidad();
  }

  async verificarDisponibilidad() {
    if ( this.editandoCita.fecha) {
      const fechaSeleccionada = new Date(this.editandoCita.fecha).setHours(0,0,0,0);
      
      const citasDelDia = this.citasExistentes.filter(cita => {
        const fechaCita = new Date(cita.fecha).setHours(0,0,0,0);
        return fechaCita === fechaSeleccionada      
      });

      // Generar todas las horas disponibles
      const horasDisp = [];
      for (let hora = 9; hora < 18; hora++) {
        const horaStr = `${hora.toString().padStart(2, '0')}:00`;
        // Incluir la hora si no hay citas o si es la hora actual de la cita
        const horaOcupada = citasDelDia.some(cita => {
          const citaHora = new Date(cita.fecha).getHours();
          return citaHora === hora;
        });

        if (!horaOcupada || this.editandoCita.hora === horaStr) {
          horasDisp.push(horaStr);
        }
      }
      this.horasDisponibles = horasDisp;
    }
  }

  async guardarCambios() {
    if (!this.validarCita()) return;

    const [hora] = this.editandoCita.hora.split(':');
    const fechaCita = new Date(this.editandoCita.fecha);
    fechaCita.setHours(parseInt(hora), 0, 0, 0);

    const citaActualizada: Partial<Cita> = {
      mascotaId: this.editandoCita.mascotaId,
      fecha: fechaCita.toISOString(),
      motivo: this.editandoCita.motivo
    };

    try {
      if (this.cita.id) {
        await this.citasService.updateCita(this.cita.id, citaActualizada);
        this.modalController.dismiss({ success: true });
      }
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  }

  validarCita(): boolean {
    return !!(
      this.editandoCita.mascotaId &&
      this.editandoCita.fecha &&
      this.editandoCita.hora &&
      this.editandoCita.motivo
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }
}