import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const expectedRole = route.data['expectedRole'];
      const userRole = await this.authService.getCurrentUserRole();
      const userId = await this.authService.getUserId();

      // Verificar si el usuario está autenticado
      if (!userId) {
        this.router.navigate(['/login']);
        return false;
      }

      // Verificar si el rol coincide
      if (userRole !== expectedRole) {
        // Redirigir según el rol del usuario
        switch (userRole) {
          case 'admin':
            this.router.navigate(['/admin-home']);
            break;
          case 'veterinario':
            this.router.navigate(['/vet-home']);
            break;
          case 'usuario':
            this.router.navigate(['/user-home']);
            break;
          default:
            this.router.navigate(['/login']);
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en auth guard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
