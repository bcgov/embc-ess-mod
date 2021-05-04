import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepAddNotesComponent } from './step-add-notes.component';

const routes: Routes = [{ path: '', component: StepAddNotesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepAddNotesRoutingModule {}
