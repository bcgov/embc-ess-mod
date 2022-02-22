import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssFileNotesComponent } from './ess-file-notes.component';

const routes: Routes = [{ path: '', component: EssFileNotesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssFileNotesRoutingModule {}
