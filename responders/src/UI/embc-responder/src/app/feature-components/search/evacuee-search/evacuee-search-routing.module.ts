import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvacueeSearchComponent } from './evacuee-search.component';

const routes: Routes = [
  { path: '', component: EvacueeSearchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeSearchRoutingModule { }
