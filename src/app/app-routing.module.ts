import { UserHomePage } from './pages/user-home/user-home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: 'agregar-mascota',
    loadChildren: () => import ('./agregar-mascota/agregar-mascota.module').then( m => m.AgregarMascotaPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'usuario'}
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'admin-home',
    loadChildren: () => import('./pages/admin-home/admin-home.module').then(m => m.AdminHomePageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'vet-home',
    loadChildren: () => import('./pages/vet-home/vet-home.module').then(m => m.VetHomePageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'veterinario' }
  },
  {
    path: 'user-home',
    loadChildren: () => import('./pages/user-home/user-home.module').then(m => m.UserHomePageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'usuario' }
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
