import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter() {
    // Limpiar el formulario cuando se vuelve a entrar a la página
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.loginUser(email, password);
      // Limpiar el formulario después de un inicio de sesión exitoso
      this.initializeForm();
    } catch (error) {
      alert('Error al iniciar sesión: ' + (error as any).message);
    }
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}