// src/app/components/nueva-cita-modal/nueva-cita-modal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NuevaCitaModalComponent } from './nueva-cita-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [NuevaCitaModalComponent]
})
export class NuevaCitaModalModule { }