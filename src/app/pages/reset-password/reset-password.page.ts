import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]]
    });
  }

  async onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
  
    try {
      const emailValue = this.resetForm.get('email')?.value;
      await this.authService.resetPassword(emailValue);
      alert('Correo de recuperación enviado con éxito.');
      this.router.navigate(['/login']);
    } catch (error) {
      const errorCode = (error as any).code;
      let errorMessage = 'Error';
  
      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta registrada con este correo electrónico.';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'El correo ingresado no tiene un formato válido.';
      }
  
      alert(errorMessage);
    }
  }
}