import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  // Definir el tipo del array `pages` explícitamente
  pages: { title: string; url: string; icon?: string; role?: string }[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Perfil', url: '/profile', icon: 'person', role: 'usuario' },
    { title: 'Citas', url: '/appointments', icon: 'calendar', role: 'veterinario' },
    { title: 'Gestión de Veterinarios', url: '/manage-vets', icon: 'paw', role: 'admin' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Método para filtrar páginas según el rol del usuario actual.
   * @param role Rol del usuario (usuario, veterinario, admin)
   */
  getPagesByRole(role: string): { title: string; url: string; icon?: string }[] {
    return this.pages.filter(page => !page.role || page.role === role);
  }

  // Función para manejar el cierre de sesión
  logout() {
    this.authService.logout(); // Llama a la función de logout del servicio AuthService
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }
}
