import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvacuationDetailsComponent } from './evacuation-details.component';

const routes: Routes = [{ path: '', component: EvacuationDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacuationDetailsRoutingModule {}
