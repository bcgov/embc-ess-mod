import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepNotesComponent } from './step-notes.component';

const routes: Routes = [{ path: '', component: StepNotesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepNotesRoutingModule {}
