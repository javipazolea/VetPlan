// src/app/components/editar-mascota-modal/editar-mascota-modal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EditarMascotaModalComponent } from './editar-mascota-modal.component';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    IonicModule
],
declarations: [EditarMascotaModalComponent],
exports: [EditarMascotaModalComponent]
})
export class EditarMascotaModalModule { }