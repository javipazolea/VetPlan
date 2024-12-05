// src/app/pages/user-home/user-home-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserHomePage } from './user-home.page';

const routes: Routes = [
  {
    path: '',
    component: UserHomePage
  },
  {
    path: 'agregar-mascota',
    loadChildren: () => import('../../agregar-mascota/agregar-mascota.module').then(m => m.AgregarMascotaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserHomePageRoutingModule {}
