import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  nameError: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  validateName() {
    if (!this.name.trim()) {
      this.nameError = 'El nombre es requerido';
    } else {
      this.nameError = '';
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
    return !this.nameError && !this.emailError && !this.passwordError &&
           this.name.trim() !== '' && this.email !== '' && this.password !== '';
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password, this.name, 'usuario');
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/login']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error durante el registro. Por favor, intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}