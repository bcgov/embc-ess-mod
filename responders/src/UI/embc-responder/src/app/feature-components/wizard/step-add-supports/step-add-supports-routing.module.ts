import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepAddSupportsComponent } from './step-add-supports.component';

const routes: Routes = [{ path: '', component: StepAddSupportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepAddSupportsRoutingModule {}
