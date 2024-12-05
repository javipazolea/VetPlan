// src/app/pages/agregar-mascota/agregar-mascota.page.ts
import { Component, OnInit } from '@angular/core';
import { MascotaService } from '../services/mascota.service';
import { AuthService } from '../services/auth.service';
import { Mascota } from '../models/mascota.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
})
export class AgregarMascotaPage implements OnInit {
  nombre: string = '';
  raza: string = '';
  edad: number = 0;
  usuarioId: string = '';
  especie: string = '';
  fechaNacimiento: string ='';


  constructor(
    private mascotaService: MascotaService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

   async ngOnInit() {
    this.authService.getUserId().then((userId) => {
      this.usuarioId = userId ?? 'usuario'; // Usa una cadena vacía si userId es null
    }).catch((error) => {
      console.error('Error obteniendo el userId:', error);
    });
  }
  limpiarFormulario() {
    this.nombre = '';
    this.raza = '';
    this.edad = 0;
    this.especie = '';
    this.fechaNacimiento = '';
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }


  async agregarMascota() {


      const nuevaMascota: Mascota = {
        nombre: this.nombre,
        especie: this.especie,
        raza: this.raza,
        edad: this.edad,
        usuarioId: this.usuarioId,
        fechaNacimiento: this.fechaNacimiento
      };

      await this.mascotaService.crearMascota(nuevaMascota);

      // Mostrar mensaje de éxito
      await this.mostrarAlerta('Éxito', 'Mascota agregada correctamente');

      // Limpiar el formulario
      this.limpiarFormulario();

      // Redirigir a la página de inicio
      this.router.navigate(['/user-home']);

  }

}
