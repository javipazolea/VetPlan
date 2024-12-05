// citas.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import {  CitasService } from '../../services/citas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit, OnDestroy {
  mascotaId: string = '';
  citas: any[] = [];
  citasSubscription!: Subscription;

  constructor(
    private citasService: CitasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.mascotaId = this.route.snapshot.paramMap.get('mascotaId')!;
    this.citasSubscription = this.citasService.getCitasByMascotaId(this.mascotaId).subscribe((data) => {
      this.citas = data;
    });
  }

  ngOnDestroy() {
    if (this.citasSubscription) {
      this.citasSubscription.unsubscribe();
    }
  }

  async deleteCita(citaId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      await this.citasService.deleteCita(citaId);
    }
  }
}
