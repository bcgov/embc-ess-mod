import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepCreateProfileComponent } from './step-create-profile.component';

const routes: Routes = [
  {path: '', component: StepCreateProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepCreateProfileRoutingModule { }
