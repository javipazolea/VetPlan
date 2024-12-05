import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VetHomePageRoutingModule } from './vet-home-routing.module';
import { VetHomePage } from './vet-home.page';
import { DetalleCitaModalComponent } from '../../components/detalle-cita-modal/detalle-cita-modal.component';
import { DetalleMascotaModalComponent } from '../../components/detalle-mascota-modal/detalle-mascota-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetHomePageRoutingModule
  ],
  declarations: [VetHomePage,
    DetalleCitaModalComponent,
    DetalleMascotaModalComponent]
})
export class VetHomePageModule {}
