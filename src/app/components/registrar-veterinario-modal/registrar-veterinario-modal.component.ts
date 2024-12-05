import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrar-veterinario-modal',
  templateUrl: './registrar-veterinario-modal.component.html',
  styleUrls: ['./registrar-veterinario-modal.component.scss']
})
export class RegistrarVeterinarioModalComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  
  nombreError: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  validateNombre() {
    if (!this.nombre.trim()) {
      this.nombreError = 'El nombre es requerido';
    } else {
      this.nombreError = '';
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.emailError = 'El correo es requerido';
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Ingrese un correo válido';
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = 'La contraseña es requerida';
    } else if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
    } else {
      this.passwordError = '';
    }
  }

  isFormValid(): boolean {
    return !this.nombreError && !this.emailError && !this.passwordError &&
           this.nombre.trim() !== '' && this.email !== '' && this.password !== '';
  }

  async registrarVeterinario() {
    try {
      await this.authService.register(this.email, this.password, this.nombre, 'veterinario');
      console.log('Veterinario registrado:', {
        email: this.email,
        nombre: this.nombre,
        rol: 'veterinario'
      });
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Veterinario registrado correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.modalController.dismiss({ success: true });
    } catch (error) {
      console.error('Error al registrar veterinario:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al registrar el veterinario. Por favor, intente nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}