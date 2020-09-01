import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvacuationFileComponent } from './evacuation-file.component';

const routes: Routes = [
  { path: '', component: EvacuationFileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacuationFileRoutingModule { }
