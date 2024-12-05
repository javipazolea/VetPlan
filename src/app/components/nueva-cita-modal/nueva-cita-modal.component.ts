// src/app/components/nueva-cita-modal/nueva-cita-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VeterinarioService } from '../../services/veterinario.service';
import { CitasService } from '../../services/citas.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { Veterinario } from '../../models/veterinario.model';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-nueva-cita-modal',
  templateUrl: './nueva-cita-modal.component.html',
  styleUrls: ['./nueva-cita-modal.component.scss']
})
export class NuevaCitaModalComponent implements OnInit {
  veterinarios: Veterinario[] = [];
  mascotas: Mascota[] = [];
  horasDisponibles: string[] = [];
  citasExistentes: Cita[] = [];
  
  nuevaCita = {
    veterinarioId: '',
    mascotaId: '',
    fecha: new Date().toISOString(),
    hora: '',
    motivo: ''
  };

  minDate = new Date().toISOString();
  maxDate = new Date();

  constructor(
    private modalController: ModalController,
    private veterinarioService: VeterinarioService,
    private citasService: CitasService,
    private mascotaService: MascotaService,
    private authService: AuthService
  ) {
    // Establecer fecha máxima (por ejemplo, 3 meses adelante)
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);
  }

  ngOnInit() {
    this.cargarDatos();
    this.generarHorasDisponibles();
  }

  async cargarDatos() {
    const userId = await this.authService.getUserId();
    if (userId) {
      // Cargar mascotas del usuario
      this.mascotaService.obtenerMascotasPorUsuarioId(userId).subscribe(
        mascotas => this.mascotas = mascotas
      );

      // Cargar veterinarios
      this.veterinarioService.getVeterinarios().subscribe(
        vets => this.veterinarios = vets
      );

      // Cargar citas existentes
      this.citasService.getCitas().subscribe(
        citas => this.citasExistentes = citas
      );
    }
  }

  generarHorasDisponibles() {
    const horas = [];
    for (let hora = 9; hora < 18; hora++) {
      horas.push(`${hora.toString().padStart(2, '0')}:00`);
    }
    this.horasDisponibles = horas;
  }

  async verificarDisponibilidad() {
    if (this.nuevaCita.veterinarioId && this.nuevaCita.fecha) {
      const fechaSeleccionada = new Date(this.nuevaCita.fecha).setHours(0,0,0,0);
      
      // Filtrar citas del mismo día y veterinario
      const citasDelDia = this.citasExistentes.filter(cita => {
        const fechaCita = new Date(cita.fecha).setHours(0,0,0,0);
        return fechaCita === fechaSeleccionada && 
               cita.veterinarioId === this.nuevaCita.veterinarioId;
      });

      // Actualizar horas disponibles
      this.horasDisponibles = this.horasDisponibles.filter(hora => {
        const horaNum = parseInt(hora.split(':')[0]);
        return !citasDelDia.some(cita => {
          const citaHora = new Date(cita.fecha).getHours();
          return citaHora === horaNum;
        });
      });
    }
  }

  async guardarCita() {
    if (!this.validarCita()) {
      return;
    }

    const userId = await this.authService.getUserId();
    if (!userId) return;

    // Crear objeto de fecha completo
    const [hora] = this.nuevaCita.hora.split(':');
    const fechaCita = new Date(this.nuevaCita.fecha);
    fechaCita.setHours(parseInt(hora), 0, 0, 0);

    const cita: Partial<Cita> = {
      mascotaId: this.nuevaCita.mascotaId,
      usuarioId: userId,
      veterinarioId: this.nuevaCita.veterinarioId,
      fecha: fechaCita.toISOString(),
      motivo: this.nuevaCita.motivo,
      estado: 'pendiente'
    };

    try {
      await this.citasService.createCita(cita);
      this.modalController.dismiss({ success: true });
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  }

  validarCita(): boolean {
    return !!(
      this.nuevaCita.veterinarioId &&
      this.nuevaCita.mascotaId &&
      this.nuevaCita.fecha &&
      this.nuevaCita.hora &&
      this.nuevaCita.motivo
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }
}