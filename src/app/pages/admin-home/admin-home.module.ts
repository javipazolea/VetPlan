import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminHomePageRoutingModule } from './admin-home-routing.module';
import { AdminHomePage } from './admin-home.page';
import { RegistrarVeterinarioModalComponent } from '../../components/registrar-veterinario-modal/registrar-veterinario-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminHomePageRoutingModule
  ],
  declarations: [
    AdminHomePage,
    RegistrarVeterinarioModalComponent
  ]
})
export class AdminHomePageModule {}