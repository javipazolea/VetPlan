import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetHomePage } from './vet-home.page';

const routes: Routes = [
  {
    path: '',
    component: VetHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetHomePageRoutingModule {}
