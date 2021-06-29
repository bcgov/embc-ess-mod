import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepSupportsComponent } from './step-supports.component';

const routes: Routes = [{ path: '', component: StepSupportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepSupportsRoutingModule {}
