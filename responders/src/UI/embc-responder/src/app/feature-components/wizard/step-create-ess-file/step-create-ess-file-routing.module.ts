import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepCreateEssFileComponent } from './step-create-ess-file.component';

const routes: Routes = [{ path: '', component: StepCreateEssFileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepCreateEssFileRoutingModule {}
