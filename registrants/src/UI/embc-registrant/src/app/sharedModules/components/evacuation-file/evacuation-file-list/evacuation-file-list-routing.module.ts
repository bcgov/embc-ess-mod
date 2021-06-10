import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvacuationFileListComponent } from './evacuation-file-list.component';

const routes: Routes = [
  {
    path: '',
    component: EvacuationFileListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacuationFileListRoutingModule {}
